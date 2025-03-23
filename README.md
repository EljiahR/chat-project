# **📌 Real-Time Chat Application**  
**Built with C#, ASP.NET Core, React, SignalR, PostgreSQL, Vite, and TypeScript**  

🚀 **Live Demo:** [Insert Deployed Link Here]  

## **🔹 Overview**  
This is a **real-time chat application** with **instant messaging, user authentication, and channel-based conversations**. It uses **SignalR WebSockets** for seamless communication and a **responsive UI** optimized for both desktop and mobile.  

## **🛠️ Tech Stack**  
- **Frontend:** React, Vite, TypeScript (**Deployed on Netlify**)  
- **Backend:** ASP.NET Core, SignalR (**Deployed on Render**)  
- **Database:** PostgreSQL  
- **Authentication:** Cookie-based authentication  

## **✨ Features**  
✅ **Real-time messaging** powered by **SignalR WebSockets**  
✅ **User authentication & session management**  
✅ **Add and manage friends & channels**  
✅ **Fully responsive UI** for **mobile & desktop**  
✅ **Persistent message history with PostgreSQL**  
✅ **Secure API endpoints with authentication**  

## **📂 Setup Instructions**  

### **🔹 Backend (ASP.NET Core)**  
1. Clone the repository:  
   ```sh  
   git clone https://github.com/EljiahR/ChatProject.Reck.git  
   cd ChatProject.Reck  
   ```  
2. Configure the **PostgreSQL database** in `appsettings.json`.  
3. Apply migrations:  
   ```sh  
   dotnet ef database update  
   ```  
4. Run the backend:  
   ```sh  
   dotnet run  
   ```  

### **🔹 Frontend (React + Vite)**  
1. Clone the frontend repo:  
   ```sh  
   git clone https://github.com/EljiahR/chat-project.git  
   cd chat-project  
   ```  
2. Install dependencies:  
   ```sh  
   npm install  
   ```  
3. Start the development server:  
   ```sh  
   npm run dev  
   ```  

## **🌎 Deployment**  
- **Frontend:** Hosted on **Netlify** → [Insert Netlify Link]  
- **Backend:** Hosted on **Render** → [Insert Render Link]  

## **🛠️ Future Improvements**  
- [ ] **Friend Requests & Accept/Reject System**  
- [ ] **Typing indicators & read receipts**  
- [ ] **Push notifications for new messages**  
- [ ] **Dark mode toggle**  
