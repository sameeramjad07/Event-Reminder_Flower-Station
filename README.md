# Event Reminder System

This project is a simple event reminder system that allows users to set reminders for various events. The system consists of a frontend and a backend to handle form submissions and store event data.

## Core Requirements

### Frontend

1. **Set Event Reminder Button**: A button on the page labeled "Set Event Reminder".
2. **Form Modal/Pop-up**: When the button is clicked, it opens a form in a modal or pop-up.
3. **Form Input Fields**:
   - Event Name
   - Event Date
   - Customer Email
   - Event Type (Birthday, Anniversary, others)
   - An option to add event type if 'Other' is chosen
   - Ability to add up to three event reminders
4. **Submit Button**: A button to send the form data to the backend.

### Backend

1. **Data Storage**: The submitted form data should be stored in a database or a structured data format (e.g., JSON, Firebase, MongoDB, MySQL, PostgreSQL, etc.).
2. **Form Handling**: The backend should handle form submissions and store data securely.
3. **Response Handling**: The system should return a success or failure response after form submission.

## Vercel Deployment

The application is deployed on Vercel and can be accessed here:  
[**Event Reminder System on Vercel**](https://event-reminder-system-gamma.vercel.app/)

## Test Credentials

Use the following credentials to test the application:

- **Email**: `test@test.com`
- **Password**: `12345678`  
  _Note_: These are for testing purposes only. Ensure you have an account set up in your authentication provider (e.g., credentials provider in NextAuth) matching these details.

## Getting Started

### Prerequisites

- Node.js
- A database system (e.g., MongoDB, MySQL, PostgreSQL)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sameeramjad07/Event-Reminder_Flower-Station.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Event-Reminder_Flower-Station
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the application in your web browser.
2. Click the "Set Event Reminder" button to open the form.
3. Fill in the event details and submit the form.
4. The backend will process the form data and store it in the database.
5. A success or failure message will be displayed based on the form submission result.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
