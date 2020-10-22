// setup server
// YOUR CODE

var express = require('express');
var app     = express();
var low     = require('lowdb');
var fs      = require('lowdb/adapters/FileSync');
var adapter = new fs('db.json');
var db      = low(adapter);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({}));


// setup directory used to serve static files
// YOUR CODE

// setup data store
// YOUR CODE

// required data store structure
// YOUR CODE
app.use(express.static('public'))

db.defaults
({ 
    accounts:[
        {name        : '',
         email       : '',
         balance     : 0,
         password    : '',
         transactions: []}
    ] 
}).write();


app.get('/accounts', function(req, res){     

    res.send(db.get('accounts').value());
 
});

app.get('/account/create/:name/:email/:password', function (req, res) {

    // YOUR CODE
    // Create account route
    // return success or failure string
    const emailId = req.params.email;
    const check = db.get('accounts').find({ email: emailId }).value()

    if (check){
        res.send(`Account already exists.`);
    } else{
    var account = {
        "name" : req.params.name,
        "email"    : req.params.email,
        "balance" : 0,
        "password" : req.params.password,
        "transactions" : []
    };

    db.get('accounts').push(account).write();
    console.log(db.get('accounts').value());  
    res.send(`Account Created!`);
    }
});

app.get('/account/login/:email/:password', function (req, res) {

    // YOUR CODE
    // Login user - confirm credentials
    // If success, return account object    
    // If fail, return null
    var emailId = req.params.email;
    var pwd = req.params.password;
    var userpwd = db.get('accounts').find({ email: emailId }).value().password;

    console.log(userpwd);

    if (pwd == userpwd){
        console.log(db.get('accounts').find({ email: emailId }).value());  
        res.send(`You're logged in!`);       
    }else {
        res.send(`Login Unsuccessful`);
    }

});

app.get('/account/get/:email', function (req, res) {
    // YOUR CODE
    // Return account based on email

    var emailId = req.params.email;
    let currentBalance = db.get('accounts').find({ email: emailId }).value().balance;
    console.log(db.get('accounts').find({ email: emailId }).value().balance);
    var bal = db.get('accounts').find({ email: emailId }).value().balance;
    res.send(`${bal}`);
});

app.get('/account/deposit/:email/:amount', function (req, res) {
    // YOUR CODE
    // Deposit amount for email
    // return success or failure string

    const emailId = req.params.email;
    const depositAmount = req.params.amount;
    const acct = db.get('accounts').find({ email: emailId }).value();

            var accbalance = db.get('accounts').find({ email: emailId }).value().balance;
            var sum = Number(depositAmount) + Number(accbalance);

            db.get('accounts')
               .find({email: emailId})
               .assign({ balance: sum})
               .write();

            if (acct){
                acct.transactions.push('Deposit: $' + depositAmount + ' on ' + new Date());
                db.write();
                res.send(`Balance Updated!`);
            } else {
                res.send(`Account does not exist`);
            }
            console.log(db.get('accounts').value());  
});

app.get('/account/withdraw/:email/:amount', function (req, res) {
    // YOUR CODE
    // Withdraw amount for email
    // return success or failure string
    var emailId = req.params.email;
    var withdrawAmount = req.params.amount;
    const acct = db.get('accounts').find({ email: emailId }).value();

            const currBalance = db.get('accounts').find({ email: emailId }).value().balance;
            const diff = Number(currBalance) - Number(withdrawAmount);
        
            db.get('accounts')
              .find({ email: emailId })
              .assign({ balance: diff})
              .write();

            if (acct){
                acct.transactions.push('Withdrawal: $' + withdrawAmount + ' on ' + new Date());
                db.write();
                res.send(`Amount Withdrawn`);
            } else {
                res.send(`Account does not exist`);
            }
            console.log(db.get('accounts').value());  
});

app.get('/account/transactions/:email', function (req, res) {
    // YOUR CODE
    // Return all transactions for account
    var emailId = req.params.email;
    const acct = db.get('accounts').find({ email: emailId }).value();
    var transactionList = '';
    if (acct){
        for (var i=0; i<acct.transactions.length; i++){
            transactionList += '\n' + acct.transactions[i] + '\n';
        }
    }
    console.log(transactionList);
    res.send(transactionList);
});

app.get('/account/all', function (req, res) {
    res.send(db.get('accounts').value());
});

// start server
// -----------------------
app.listen(3000, function(){
    console.log('Running at port 3000');
})