
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const path = require("path");
const fs = require("fs");

chai.use(chaiHttp);

const { startServer, app } = require("../new_features/server");
const { dbPath } = require("../new_features/database");

describe("Novos Endpoints de API (Produtos e Serviços)", () => {
    let serverApp; 

    beforeEach(function(done) {
        this.timeout(5000); 
        if (dbPath && fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }

        startServer((err, appInstance) => {
            if (err) return done(err);
            serverApp = appInstance;
            done();
        });
    });

    afterEach((done) => {
        if (dbPath && fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
        done();
    });

    describe("POST /api/products", () => {
        it("deve adicionar um novo produto", (done) => {
            chai.request(serverApp)
                .post("/api/products")
                .send({ name: "Ração para Cães", price: 50.00, stock: 100 })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.have.property("id");
                    expect(res.body.name).to.equal("Ração para Cães");
                    done();
                });
        });

        it("deve retornar 400 se faltarem campos obrigatórios (nome)", (done) => {
            chai.request(serverApp)
                .post("/api/products")
                .send({ price: 20.00, stock: 50 })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("error").to.equal("Nome, preço e estoque são obrigatórios.");
                    done();
                });
        });
    });

    describe("GET /api/products", () => {
        it("deve listar todos os produtos", (done) => {
            chai.request(serverApp)
                .post("/api/products")
                .send({ name: "Produto Teste", price: 10.00, stock: 10 })
                .end(() => {
                    chai.request(serverApp)
                        .get("/api/products")
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.an("array");
                            expect(res.body.length).to.be.above(0); 
                            done();
                        });
                });
        });
    });

    describe("POST /api/services", () => {
        it("deve adicionar um novo serviço", (done) => {
            chai.request(serverApp)
                .post("/api/services")
                .send({ name: "Banho e Tosa", description: "Serviço completo de banho e tosa", price: 80.00 })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.have.property("id");
                    expect(res.body.name).to.equal("Banho e Tosa");
                    done();
                });
        });

        it("deve retornar 400 se faltarem campos obrigatórios (nome)", (done) => {
            chai.request(serverApp)
                .post("/api/services")
                .send({ description: "Consulta de rotina", price: 120.00 })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("error").to.equal("Nome e preço são obrigatórios.");
                    done();
                });
        });
    });

    describe("GET /api/services", () => {
        it("deve listar todos os serviços", (done) => {
            chai.request(serverApp)
                .post("/api/services")
                .send({ name: "Serviço Teste", description: "Descrição do serviço", price: 25.00 })
                .end(() => {
                    chai.request(serverApp)
                        .get("/api/services")
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.an("array");
                            expect(res.body.length).to.be.above(0); 
                            done();
                        });
                });
        });
    });
});

