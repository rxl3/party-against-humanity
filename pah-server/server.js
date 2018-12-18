const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cards = require('./cards.json');

const app = express();

const rooms = {};

app.use(bodyParser.json());

app.use((req, res, next)  => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.route('/api/room').post((req, res) => {
  const name = req.body.name;
  const id = req.body.id;
  console.log("Room request from " + name);
  console.log("Room ID: " + id);
  if (rooms[id]) {
    if (rooms[id]['players'].indexOf(name) !== -1) {
      res.status(400).send({error: 'Duplicate player name'});
    } else if (rooms[id]['players'].length >= 8) {
      res.status(400).send({error: 'Room is full'});
    } else {
      rooms[id]['players'].push(name);
      res.status(200).send(req.body);
    }
  } else {
    rooms[req.body.id] = {usedCards: [], players: [req.body.name], activePlayer: 0, submissions: [], blackCard: null, startGame: false, round: 0};
    res.status(200).send(req.body);
  }
});

app.route('/api/room/:id').get((req, res) => {
  const room =  rooms[req.params['id']];
  const response = {
    players: room.players,
    startGame:  room.startGame,
    activePlayer:  room.players[room.activePlayer],
    submissions:  room.submissions,
    blackCard:  room.blackCard,
    round: room.round
  };
  res.status(200).send({data: response});
});

app.route('/api/room/:id/start').get((req, res) => {
  const room = rooms[req.params['id']];
  room.startGame = true;
  res.status(200).send(room);
});

app.route('/api/room/:id/cards-white/:num').get((req, res) => {
  const cardSet = [];
  for (let i = 0; i < parseInt(req.params['num'], 10); i++) {
    let rand = Math.floor(Math.random() * cards.whiteCards.length);
    while (rooms[req.params['id']].usedCards.indexOf(cards.whiteCards[rand]) > -1) {
      rand = Math.floor(Math.random() * cards.whiteCards.length);
    }
    cardSet.push(cards.whiteCards[rand]);
    rooms[req.params['id']].usedCards.push(cards.whiteCards[rand]);
  }
  console.log('Sending ' + cardSet.length + ' cards!');
  res.status(200).send({data: cardSet})
});

app.route('/api/room/:id/cards-black').get((req, res) => {
  res.status(200).send({data: rooms[req.params['id']].blackCard});
});

app.route('/api/room/:id/cards-black/new').get((req, res) => {
  let blackCard = null;
  let rand = Math.floor(Math.random() * cards.blackCards.length);
  while (rooms[req.params['id']].usedCards.indexOf(cards.blackCards[rand].text) > -1) {
    rand = Math.floor(Math.random() * cards.blackCards.length);
  }
  blackCard = cards.blackCards[rand];
  rooms[req.params['id']].usedCards.push(blackCard.text);
  blackCard.text = blackCard.text.replace(/_/g, '_____');
  rooms[req.params['id']].blackCard = blackCard;
  res.status(200).send({data: {card: blackCard, roomSize: rooms[req.params['id']].players.length}})
});

app.route('/api/cards').get((req, res) => {
  res.status(200).send({data: cards})
});

app.route('/api/room/:id/submit-white').post((req, res) => {
  const room = rooms[req.params['id']];
  const activePlayer = room.players[room.activePlayer];

  if (req.body.name === activePlayer) {
    console.log('Winner received!');
    console.log(req.body.name, req.body.cards);
    room.activePlayer = (room.activePlayer + 1) % room.players.length;
    room.submissions = [];
    room.blackCard = null;
    room.round++;
    res.status(200).send(req.body);
  } else {
    console.log("Submission from " + req.body.name);
    console.log(req.body.cards);
    room.submissions.push({name: req.body.name, cards: req.body.cards});
    res.status(200).send(req.body);
  }
});

app.listen(8000, () => {
  console.log("server started!");
});
