# **App Name**: EcoMensa

## Core Features:

- Meal Package Listing: Display a list of available meal packages from `daily_meals` collection for students, showing name, description, price, and pickup time.
- Meal Reservation: Allow students to reserve meal packages.  Atomically decrement the `current_stock` in `daily_meals` using Firebase Transactions to prevent overbooking. Display a QR code upon successful reservation, stored in `orders`.
- Admin Dashboard: Enable administrators to create, edit, and manage meal packages (`daily_meals` collection). Display live statistics on remaining packages and today's revenue.
- Kitchen Terminal Display: Display a large, easy-to-read interface for kitchen staff, showing the number of packages remaining to be picked up.
- QR Code Scanner: Implement a QR code scanner function in the Kitchen Terminal to update order status to `PICKED_UP` in the `orders` collection. Alternatively, provide an input field for manual code entry.
- User Role Management: Implement user authentication and role management to differentiate between students, admins, and kitchen staff. Only admins can write to `daily_meals`, and only kitchen staff can update `orders` to `PICKED_UP`.
- Anomaly Detection: Use an anomaly detection tool to find deviations between actuals vs expected left overs.

## Style Guidelines:

- Primary color: Deep forest green (#228B22) to reflect freshness and sustainability. 
- Background color: Very light desaturated green (#F0FAF0) to create a calm and clean interface.
- Accent color: Earthy yellow (#D4A27A) to draw attention to key elements like CTAs.
- Font pairing: 'Poppins' (sans-serif) for headlines, and 'PT Sans' (sans-serif) for body text.
- Use simple, outlined icons to represent different meal categories (vegetarian, meat, etc.).
- Mobile-first design for student view, ensuring a seamless experience on smartphones.  High-contrast, large fonts for the Kitchen Terminal to ensure readability.
- Subtle animations on the student view to confirm actions, such as a 'reserved' animation upon successful meal reservation.