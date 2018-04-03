var express = require('express');
var router = express.Router();
var braintree = require('braintree');
var keys = require('../../models/keys');

router.get('/braintree',(req, res)=>{
  res.render('./payment/paypal/braintree.ejs');
});

router.post('/braintree', function(req, res, next) {
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: keys.braintree.merchantId,
    publicKey: keys.braintree.publicKey,
    privateKey: keys.braintree.privateKey
  });

  // Use the payment method nonce here
  var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale({
    amount: '18.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true,
      storeInVaultOnSuccess: true
    }
  }, function(error, result) {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});

router.get('/expressCheckout', (req, res)=>{
  res.render('./payment/paypal/expressCheckout.ejs');
});

module.exports = router;