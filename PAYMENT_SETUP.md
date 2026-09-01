# Live Razorpay setup (required for real payments)

A static GitHub Pages site cannot safely contain a Razorpay Key Secret. The payment button is therefore wired to secure backend endpoints.

1. Create the database by running `supabase/schema.sql` in Supabase SQL Editor.
2. Create a private Storage bucket named `celebration-photos`.
3. Create a serverless function or Supabase Edge Function that:
   - verifies the Supabase user JWT;
   - reads the celebration from the database and calculates the price on the server;
   - creates the Razorpay order using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`;
   - returns only the public `key_id`, Razorpay `order_id`, amount and currency.
4. Create a verification endpoint that validates Razorpay's payment signature on the server.
5. Only after signature verification, insert/update the `orders` row and set the celebration status to `paid`.
6. Put the two public function URLs into `payment-config.js`.

Never put a Razorpay Key Secret in HTML or JavaScript.
