export const Event_Book_Template = `<div style="
    font-family: Arial, Helvetica, sans-serif;
    max-width: 600px;
    margin: auto;
    background-color: #f4f6fb;
    padding: 30px;
    border-radius: 12px;
  ">

    <!-- Header -->
    <div style="
      background: linear-gradient(135deg, #6d28d9, #8b5cf6);
      padding: 25px;
      border-radius: 10px;
      text-align: center;
      color: #ffffff;
    ">
      <h1 style="margin: 0; font-size: 26px;">Welcome to EventCraft 🎉</h1>
      <p style="margin-top: 8px; font-size: 14px;">
        Crafting unforgettable events, effortlessly
      </p>
    </div>

    <!-- Content -->
    <div style="
      background-color: #ffffff;
      padding: 25px;
      margin-top: 20px;
      border-radius: 10px;
      color: #333;
      line-height: 1.6;
    ">

      <p style="font-size: 16px;">
        Hi <strong>{firstname} {lastname}</strong>,
      </p>
		
      <div style="background-color:#f9f9f9; color:#000; border-radius:10px; padding:5px; width:430px;">
        <h3>Details of user who book this event</h2>
        <ul> 
           <li><span>User Email: </span><span>{email}</span></li>
           <li><span>User Name: </span><span>{firstname} {lastname}</span></li>
           <li><span>Event Type: </span><span>{eventType}</span></li>
           <li><span>Event Theme: </span><span>{eventTheme}</span></li>
           <li><span>Event Booking Date: </span><span>{bookingDate}</span></li>
           <li><span>Event Guest Count: </span><span>{guestCount}</span></li>
           <li><span>Total Amount: </span><span>{totalAmount}</span></li>
           <li><span>Payment Status: </span><span>{paymentStatus}</span></li>
           <li><span>Booking Status: </span><span>{bookingStatus}</span></li>


       </ul>
      </div>

  

   
      <!-- CTA -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="http://localhost:5173/admin"
          style="
            display: inline-block;
            background-color: #6d28d9;
            color: #ffffff;
            padding: 14px 26px;
            text-decoration: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: bold;
          ">
          Go to Dashboard →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <p style="
      font-size: 12px;
      color: #888;
      text-align: center;
      margin-top: 25px;
    ">
      Need help? Reach out anytime via live chat.<br/>
      © ${new Date().getFullYear()} EventCraft. All rights reserved.
    </p>

  </div>`