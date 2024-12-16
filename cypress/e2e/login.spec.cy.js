describe('Google Login Popup Test', () => {
    beforeEach(() => {
      cy.visit('localhost:3000');  // Replace with your app's URL
    });
    it("successfully logins via google popup", () => {
      cy.get('button').contains('Sign in with Google').click();
      cy.wait(5000);
        // Visit your app's homepage where Google login is triggered
        cy.visit('localhost:3000');
    
        // Check if the user is redirected to /dashboard after successful login
        cy.url().should('include', '/dashboard');
            }) 
});