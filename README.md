Overview 
    The simple pub/sub system for this project creates an app route and a basic controller to demonstrate how the PublishSubscribeService handles events. 
    The main features are as follows:

    /machine
        / : Get all machines – to view the list of all machines.
        / : Create a machine – If the machine ID already exists, it cannot be created.
        /{id} : Delete a machine – If the machine with the given ID does not exist, it cannot be deleted.
    /pubsub
        /get all : View the list of machines that are already subscribed.
        /subscribe : Add an existing machine to the list of managed machines.
            If the machine does not exist in the list of machines, it cannot be added.
            If the machine is already in the list of machine subscribers, it cannot be subscribed again.
        /unsubscribe : Remove a machine from the list of machine subscribers.
            If the machine does not exist in the list of machine subscribers, it cannot be removed.
        /publish : Manage the reduction or increase of the stockLevel in machine subscribers.
            If the type is 'sale', it will reduce the stockLevel by 1.
                If the stock decreases below 3, it will log a LowStockWarningEvent once.
                If the stockLevel reaches 0, it will not reduce the stockLevel further.
            If the type is 'refill', it will increase the stockLevel.
                If the stock level was below 3 before and is now increased above 3, it will log a StockLevelOkEvent once.

You can try it with import postman_collection.json

ภาพรวม
    Simple pubsub สำหรับ โปรเจ็ค นี้ เป็น สร้าง app route และ controller แบบง่าย เพื่อใช้ในการทำตัวอย่าง การ จัดการ event ของ PublishSubscribeService เท่านั้น
โดยจะมี feature หลักดังนี้
    /machine
        / : get all machine สำหรับ ดู รายการ machines ทั้งหมด
        / : create machine โดย ที่ หาก id  ซ้ำ จะ สร้างไม่ได้
        /{id} : delete machine โดย ที่ หาก ไม่มี machine id นั้น จะลบไม่ได้
    /pubsub
        / get all: สำหรับ ดูรายการ machines ที่ subcribe แล้ว
        /subscribe : สำหรับ นำ machine ที่มีอยู่ มา เพิ่มในรายการ ที่จัดการได้
            หาก ไม่มี machine ใน รายการ machines จะเพิ่มไม่ได้
            หาก machine ใน machine subscribers อยู่แล้ว จะลบไม่ได้
        /unsubscribe : สำหรับลบ machine ที่มีอยู่ใน รายการ machine subscribers
            หาก ไม่มี machine ใน รายการ machine subscribers จะลบไม่ได้
        /publish: สำหรับ จัดการ ลด หรือ เพิ่ม stockLevel ใน machine subscribers
            หาก type เป็น 'sale' จะ ลดจำนวน stockLevel ลง 1
                หาก ลดจำนวณ ลง น้อย กว่า 3 จะมีการ loging LowStockWarningEvent 1 ครั้ง
                หาก stockLevel เป็น 0 จะไม่ทำการ ลด stockLevel อีก
            หาก type เป็น 'refill' จะทำการ เพิ่มจำนวน stockLevel โดย ที่ 
                หาก ก่อนหน้านี้ low เป็น 3 และ ได้ เพิ่มจำนวน ปัจจุบัน จนมากกว่า 3 จะทำการ logging StockLevelOkEvent 1 ครั้ง

โดย สามารถทดสอบได้ จาก postman_collection.json


How to Setup
1. Clone the Repository
    git clone https://github.com/npcpro/simple-pubsub
    cd simple-pubsub
2. Install Dependencies
    npm install

How to Run
1. Run the Application
You can start the application using the following command: npm start

2. Run in Development Mode To run the project with hot-reloading (via nodemon):
npm run dev

*** NOW FIX PORT TO 3000