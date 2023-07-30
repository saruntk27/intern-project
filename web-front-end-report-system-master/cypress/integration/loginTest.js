/* eslint-disable no-undef */
describe("render the home page", () => {
  before(() => {
    cy.visit("/");
  });

  it("username field not added yet", () => {
    cy.get("#password").type("admin").should("have.value", "admin");
    cy.get(".loginbtn").click();
    expect(alert);
  });

  it("password field not added yet", () => {
    cy.get("#username").type("admin").should("have.value", "admin");
    cy.get(".loginbtn").click();
  });

  it("all fields not added yet", () => {
    cy.get(".loginbtn").click();
  });

  it("admin all correct", () => {
    cy.get("#username").type("admin").should("have.value", "admin");
    cy.get("#password").type("admin").should("have.value", "admin");
    cy.get(".loginbtn").click();
    cy.url().should("include", "/main");
  });
});
