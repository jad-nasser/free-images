/// <reference types='Cypress' />
describe("e2e testing", () => {
  it("The user should sign up, edit account name, add 3 images, edit the second image, delete the third image, and then sign out", () => {
    //sign up
    cy.visit("http://localhost:3000/sign-up");
    cy.get('input[placeholder="First Name"]').type("Test");
    cy.get('input[placeholder="Last Name"]').type("Test");
    cy.get('input[placeholder="Email Address"]').type("testtest@email.com");
    cy.get('input[placeholder="Account Password"]').type("Q1!wasdf");
    cy.get('input[placeholder="Confirm Password"]').type("Q1!wasdf");
    cy.get('button:contains("Sign Up")').click();
    cy.wait(2000);
    //sign in
    cy.get('input[placeholder="Email"]').type("testtest@email.com");
    cy.get('input[placeholder="Password"]').type("Q1!wasdf");
    cy.get('button:contains("Sign In")').click();
    cy.wait(2000);
    //edit account name
    cy.get('a:contains("Account Settings"):visible').click();
    cy.wait(2000);
    cy.get('a:contains("Change Your Name"):visible').click();
    cy.wait(1000);
    cy.get('input[placeholder="New First Name"]').type("Test2");
    cy.get('input[placeholder="New Last Name"]').type("Test2");
    cy.get('button:contains("Change Name")').click();
    cy.wait(1000);
    cy.contains("Your name successfully changed");
    //adding 3 images
    cy.get('a:contains("Add Image"):visible').click();
    cy.wait(2000);
    cy.get('input[placeholder="Image Name"]').type("test-image1");
    cy.get('input[type="file"]').attachFile("test-image1.jpg");
    cy.get('button:contains("Add Image")').click();
    cy.wait(1000);
    cy.get('input[placeholder="Image Name"]').clear().type("test-image2");
    cy.get('button:contains("Add Image")').click();
    cy.wait(1000);
    cy.get('input[placeholder="Image Name"]').clear().type("test-image3");
    cy.get('button:contains("Add Image")').click();
    cy.wait(1000);
    //edit the second image
    cy.get("a:contains(Free Images)").click();
    cy.wait(2000);
    cy.contains("test-image2").click();
    cy.wait(2000);
    cy.get('input[placeholder="New Image Name"]').type("test-image22");
    cy.get('button:contains("Edit Image")').click();
    cy.wait(1000);
    cy.contains("Image successfully edited");
    //delete the third image
    cy.get("a:contains(Free Images)").click();
    cy.wait(2000);
    cy.contains("test-image3").click();
    cy.wait(2000);
    cy.get('button:contains("Delete Image")').click();
    cy.get('button:contains("Yes")').click();
    cy.wait(1000);
    //sign out
    cy.get('button:contains("Sign Out"):visible').click();
    cy.wait(2000);
  });

  it('A non signed in user should search for image called "test-image1" and view it', () => {
    //searching for the image sice the search contains regex we will only type "1"
    cy.visit("http://localhost:3000/home");
    cy.get('input[placeholder="Search Images"]').type("1");
    cy.get('button:contains("Search")').click();
    cy.wait(2000);
    //viewing the image
    cy.contains("test-image1").click();
    cy.wait(2000);
  });

  it("The user that creates an account in the first test should sign in and deactivate the account", () => {
    //sign in
    cy.visit("http://localhost:3000/sign-in");
    cy.get('input[placeholder="Email"]').type("testtest@email.com");
    cy.get('input[placeholder="Password"]').type("Q1!wasdf");
    cy.get('button:contains("Sign In")').click();
    cy.wait(2000);
    //deactivate account
    cy.get('a:contains("Account Settings"):visible').click();
    cy.wait(2000);
    cy.get('a:contains("Deactivate Your Account"):visible').click();
    cy.wait(1000);
    cy.get('button:contains("Deactivate Account")').click();
    cy.get('button:contains("Yes")').click();
    cy.wait(2000);
  });
});
