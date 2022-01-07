const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const StripeKey = require('./config/stripe');

const stripe = require('stripe')(StripeKey.stripe_secret);

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname,'/public/')))

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('Home', {
        key: StripeKey.publishable_key
    })
})

app.post('/payment', async (req, res) => {
    try {
        let customer = await stripe.customers.create({
            description: 'testing stripe customer api sdk',
            source: req.body.stripeToken
        })
    
        if(customer.id) {
            let charge = await stripe.charges.create({
                amount: 500 * 100,
                currency: 'PKR',
                description: 'charge sandbox!',
                customer: customer.id
            })
    
            if(charge) {
                console.log(charge);
                res.send(`PAID! CHECK RECIEPT ${charge.receipt_url}`);
            }
        }
    } catch (err) {
        console.log(err);
        res.send(err.message)
    }

})

app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
})