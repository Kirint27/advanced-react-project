describe('kaban board ', () => {
    beforeEach(() => {
      cy.visit('localhost:3000/dashboard');  // Replace with your app's URL
    });
    it("View Kanban Board for project", () => {
               // Check if the user is redirected to /dashboard after successful login
               cy.visit('localhost:3000/dashboard')
               cy.wait(5000);
               cy.url().should('include', '/dashboard');
               cy.get('a').contains('Projects').click()
               cy.get('.Projects_button__w03aK').click();
               cy.get(':nth-child(2) > input').type('Test Project');
               cy.get('textarea').type('Test Project Description');
               cy.get(':nth-child(4) > input').type('2024-12-28')
               cy.get('select').select('High');
               cy.get('[type="submit"]').click();                
       
               cy.get('.Projects_button__w03aK').click();
               cy.get('button').contains('View Tasks').click()
            }) 
});