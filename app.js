const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

app.set('view engine', 'ejs');
app.use(bodyparser.json()); // parsing the application/json
app.use(bodyparser.urlencoded({ extended: true })); // parses the x-www-form-urlencoded

Material = require('./models/material');
Suppliers = require('./models/supplier');

// Update the mongoose connection with the recommended options
mongoose.connect('mongodb://localhost/inventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;

function today() {
    var date = new Date();
    var todaydate = date.toDateString();
    var minutes = date.getUTCMinutes();
    var hours = date.getHours();
    var seconds = date.getSeconds();
    var format = hours + ':' + minutes + ':' + seconds + ' ' + todaydate;
    return format;
};

function sanitizer(string) {
    string = entities.encode(string);
    return string;
}

// Routes
app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/addmaterial', (req, res) => {
    res.render('addmaterial');
});

app.get('/editmaterial/:id', (req, res) => {
    var id = req.params.id;
    res.render('editmaterial', { id: id });
});

app.get('/materials', (req, res) => {
    Material.getMaterials((err, materials) => {
        if (err) {
            res.render('material', {
                msg: 'Error in getting details..'
            });
        } else {
            var obj = materials;
            res.render('material', { obj: obj });
        }
    })
});

// Add materials
app.post('/addmaterial', (req, res) => {
    var name = entities.encode(req.body.name);
    var price = entities.encode(req.body.price);
    var qty = entities.encode(req.body.qty);
    var state = entities.encode(req.body.state);
    var on = today();
    Material.addMaterial({
        name: name, price: price, qty: qty, state: state, created_on: on
    }, (err, material) => {
        if (err) {
            res.render('addmaterial', {
                msg: 'Please fill required details!'
            })
        }
        var obj = material;
        res.redirect('/materials');
    });
});

// Update material
app.post('/editmaterial/:id', (req, res) => {
    var id = req.params.id;
    var name = entities.encode(req.body.name);
    var price = entities.encode(req.body.price);
    var qty = entities.encode(req.body.qty);
    var state = entities.encode(req.body.state);
    var on = today();
    Material.updateMaterial(id, {
        name: name, price: price, qty: qty, state: state, created_on: on
    }, {}, (err, callback) => {
        if (err) {
            res.render('editmaterial', { msg: "Error Occured." });
        }
        res.redirect('/materials');
    });
});

// Delete material
app.post('/deletematerial/:_id', (req, res) => {
    var id = req.params._id;
    Material.removeMaterial(id, (err, callback) => {
        if (err) { throw err }
        res.redirect('/materials');
    });
});

app.post('/showmaterials/:id', (req, res) => {
    var id = req.params.id;
    Material.findbyid(id, (err, materials) => {
        if (err) { throw err; }
        var obj = materials;
        res.render('showmaterials', { obj: obj });
    });
});

// Supplier routes
app.get('/addsupplier', (req, res) => {
    res.render('addsupplier');
});

app.get('/editsupplier/:id', (req, res) => {
    var id = req.params.id;
    res.render('editsupplier', { id: id });
});

app.get('/suppliers', (req, res) => {
    Suppliers.getSuppliers((err, suppliers) => {
        if (err) {
            res.render('supplier', {
                msg: 'some error occured!!'
            });
        }
        var obj = suppliers;
        res.render('supplier', { obj: obj });
    });
});

app.post('/addsupplier', (req, res) => {
    var cmpname = sanitizer(req.body.cmpname);
    var materialname = sanitizer(req.body.materialname);
    var state = sanitizer(req.body.state);
    var emailid = sanitizer(req.body.emailid);
    var contactno = sanitizer(req.body.contactno);
    var address = sanitizer(req.body.address);
    var costprice = sanitizer(req.body.costprice);
    var qty = sanitizer(req.body.qty);
    var on = today();
    var supplier = { cmpname: cmpname, materialname: materialname, state: state, emailid: emailid, contactno: contactno, address: address, costprice: costprice, qty: qty, created_on: on };
    Suppliers.addSupplier(supplier, (err, supplier) => {
        if (err) { throw err }
        res.redirect('/suppliers');
    })
});

app.get('/showsupplier/:id', (req, res) => {
    var id = req.params.id;
    Suppliers.getSuppliersById(id, (err, supplier) => {
        if (err) { throw err }
        var obj = supplier;
        res.render('showsupplier', { obj: obj });
    });
});

app.post('/editsupplier/:_id', (req, res) => {
    var id = req.params._id;
    var cmpname = sanitizer(req.body.cmpname);
    var materialname = sanitizer(req.body.materialname);
    var state = sanitizer(req.body.state);
    var emailid = sanitizer(req.body.emailid);
    var contactno = sanitizer(req.body.contactno);
    var address = sanitizer(req.body.address);
    var costprice = sanitizer(req.body.costprice);
    var qty = sanitizer(req.body.qty);
    var on = today();
    var supplier = { cmpname: cmpname, materialname: materialname, state: state, emailid: emailid, contactno: contactno, address: address, costprice: costprice, qty: qty, created_on: on };
    Suppliers.updateSupplier(id, supplier, {}, (err, supplier) => {
        if (err) {
            throw err
        }
        res.redirect('/suppliers');
    });
});

app.post('/deletesupplier/:_id', (req, res) => {
    var id = req.params._id;
    Suppliers.removeSupplier(id, (err, callback) => {
        if (err) { throw err }
        res.redirect('/suppliers');
    });
});

app.listen(8080, () => {
    console.log('running in port 8080..');
});
