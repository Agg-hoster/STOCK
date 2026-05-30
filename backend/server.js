const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()

app.use(cors())
app.use(express.json())

// ================= DATABASE =================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "SMS"
})

db.connect(err => {
    if (err) console.log(err)
    else console.log("MySQL Connected")
})

// ================= JWT =================
const JWT_SECRET = "stockhub_secret"

// ================= AUTH MIDDLEWARE =================
const auth = (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1]

    if (!token) return res.status(401).json({ message: "No token" })

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" })
        req.user = user
        next()
    })
}

/* =====================================================
===================== AUTH =============================
===================================================== */

// REGISTER
app.post("/register", async (req, res) => {

    const { fullname, email, phone, username, password } = req.body

    if (!fullname || !email || !phone || !username || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields required"
        })
    }

    db.query(
        "SELECT * FROM users WHERE username=?",
        [username],
        async (err, result) => {

            if (result.length > 0) {
                return res.json({
                    success: false,
                    message: "Username already exists"
                })
            }

            const hash = await bcrypt.hash(password, 10)

            db.query(
                "INSERT INTO users(fullname,email,phone,username,password) VALUES (?,?,?,?,?)",
                [fullname, email, phone, username, hash],
                (err) => {
                    if (err) return res.json(err)

                    res.json({
                        success: true,
                        message: "User registered successfully"
                    })
                }
            )
        }
    )
})

// LOGIN
app.post("/login", (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "All fields required" })
    }

    db.query(
        "SELECT * FROM users WHERE username=?",
        [username],
        async (err, result) => {

            if (result.length === 0) {
                return res.status(404).json({ message: "User not found" })
            }

            const user = result[0]

            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                return res.status(401).json({ message: "Wrong password" })
            }

            const token = jwt.sign(
                { id: user.id },
                JWT_SECRET,
                { expiresIn: "1d" }
            )

            res.json({
                success: true,
                token
            })
        }
    )
})

/* =====================================================
===================== PRODUCTS =========================
===================================================== */

app.post("/products", auth, (req, res) => {

    const {
        productName,
        category,
        quantityInStock,
        unitPrice,
        supplierName,
        dateReceived
    } = req.body

    if (!productName || !category || !quantityInStock || !unitPrice || !supplierName || !dateReceived) {
        return res.status(400).json({ message: "All fields required" })
    }

    db.query(
        `INSERT INTO Product(productName,category,quantityInStock,unitPrice,supplierName,dateReceived)
        VALUES (?,?,?,?,?,?)`,
        [productName, category, quantityInStock, unitPrice, supplierName, dateReceived],
        (err) => {
            if (err) return res.json(err)
            res.json({ message: "Product added" })
        }
    )
})

app.get("/products", auth, (req, res) => {
    db.query("SELECT * FROM Product", (err, r) => res.json(r))
})

app.put("/products/:id", auth, (req, res) => {
    db.query(
        `UPDATE Product SET productName=?,category=?,quantityInStock=?,unitPrice=?,supplierName=?,dateReceived=? WHERE productCode=?`,
        [...Object.values(req.body), req.params.id],
        () => res.json({ message: "Updated" })
    )
})

app.delete("/products/:id", auth, (req, res) => {
    db.query("DELETE FROM Product WHERE productCode=?", [req.params.id], () => {
        res.json({ message: "Deleted" })
    })
})

/* =====================================================
===================== WAREHOUSE ========================
===================================================== */

app.post("/warehouses", auth, (req, res) => {

    const { warehouseName, warehouseLocation } = req.body

    if (!warehouseName || !warehouseLocation) {
        return res.status(400).json({ message: "All fields required" })
    }

    db.query(
        "INSERT INTO Warehouse(warehouseName,warehouseLocation) VALUES (?,?)",
        [warehouseName, warehouseLocation],
        () => res.json({ message: "Warehouse added" })
    )
})

app.get("/warehouses", auth, (req, res) => {
    db.query("SELECT * FROM Warehouse", (err, r) => res.json(r))
})

app.put("/warehouses/:id", auth, (req, res) => {
    db.query(
        "UPDATE Warehouse SET warehouseName=?,warehouseLocation=? WHERE warehouseCode=?",
        [req.body.warehouseName, req.body.warehouseLocation, req.params.id],
        () => res.json({ message: "Updated" })
    )
})

app.delete("/warehouses/:id", auth, (req, res) => {
    db.query("DELETE FROM Warehouse WHERE warehouseCode=?", [req.params.id], () => {
        res.json({ message: "Deleted" })
    })
})

/* =====================================================
=================== TRANSACTIONS =======================
===================================================== */

app.post("/transactions", auth, (req, res) => {

    const {
        productCode,
        warehouseCode,
        transactionDate,
        quantityMoved,
        transactionType
    } = req.body

    if (!productCode || !warehouseCode || !transactionDate || !quantityMoved || !transactionType) {
        return res.status(400).json({ message: "All fields required" })
    }

    if (quantityMoved <= 0) {
        return res.status(400).json({ message: "Quantity must be > 0" })
    }

    db.query(
        `INSERT INTO StockTransaction(productCode,warehouseCode,transactionDate,quantityMoved,transactionType)
        VALUES (?,?,?,?,?)`,
        [productCode, warehouseCode, transactionDate, quantityMoved, transactionType],
        () => res.json({ message: "Transaction saved" })
    )
})

app.get("/transactions", auth, (req, res) => {

    const sql = `
        SELECT t.transactionId,
        p.productName,
        w.warehouseName,
        t.transactionDate,
        t.quantityMoved,
        t.transactionType
        FROM StockTransaction t
        JOIN Product p ON t.productCode=p.productCode
        JOIN Warehouse w ON t.warehouseCode=w.warehouseCode
    `

    db.query(sql, (err, r) => res.json(r))
})

app.put("/transactions/:id", auth, (req, res) => {
    db.query(
        `UPDATE StockTransaction SET productCode=?,warehouseCode=?,transactionDate=?,quantityMoved=?,transactionType=? WHERE transactionId=?`,
        [...Object.values(req.body), req.params.id],
        () => res.json({ message: "Updated" })
    )
})

app.delete("/transactions/:id", auth, (req, res) => {
    db.query("DELETE FROM StockTransaction WHERE transactionId=?", [req.params.id], () => {
        res.json({ message: "Deleted" })
    })
})

/* =====================================================
===================== REPORTS ==========================
===================================================== */

app.get("/reports/:type", auth, (req, res) => {

    let condition = ""

    if (req.params.type === "daily") {
        condition = "WHERE DATE(t.transactionDate)=CURDATE()"
    }

    if (req.params.type === "weekly") {
        condition = "WHERE YEARWEEK(t.transactionDate)=YEARWEEK(CURDATE())"
    }

    if (req.params.type === "monthly") {
        condition = "WHERE MONTH(t.transactionDate)=MONTH(CURDATE())"
    }

    const sql = `
        SELECT t.transactionId,
        p.productName,
        w.warehouseName,
        t.transactionDate,
        t.quantityMoved,
        t.transactionType
        FROM StockTransaction t
        JOIN Product p ON t.productCode=p.productCode
        JOIN Warehouse w ON t.warehouseCode=w.warehouseCode
        ${condition}
    `

    db.query(sql, (err, r) => res.json(r))
})

/* =====================================================
===================== SERVER ===========================
===================================================== */

app.listen(5000, () => {
    console.log("Server running on port 5000")
})