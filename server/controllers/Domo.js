const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    fact: req.body.fact,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, fact: newDomo.fact });
    // return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  // console.log(req.params);
  // docs.forEach((val) => {
  //   DomoModel.findByOwnerAndDelete(val._id, (er, doc) => {
  //     if (er) {
  //       console.log(er);
  //       return res.status(400).json({ error: 'An error occurred!' });
  //     }
  //     console.log(doc);
  //     return doc;
  //   });
  // });
  DomoModel.findByOwnerAndDelete(docs[0]._id, (er, doc) => {
    if (er) {
      console.log(er);
      return res.status(400).json({ error: 'An error occurred!' });
    }
    console.log(doc);
    return doc;
  });
  return res.json({ domos: docs });
});

const deleteDomo = (req, res) => DomoModel.findByOwner(req.session.account._id, (e, doc) => {
  if (e) {
    console.log(e);
    return res.status(400).json({ error: 'An error occurred!' });
  }
  console.log(doc);
  return doc;

  // I need two ids. The one of the user, and the one of the domo
});

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
