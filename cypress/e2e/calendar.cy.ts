describe('Calendar Mobile Experience', () => {
  beforeEach(() => {
    // Set mobile viewport
    cy.viewport(375, 667);

    // Mock API responses
    cy.intercept('GET', '/appointments/availability*', {
      fixture: 'availability.json'
    }).as('getAvailability');

    cy.visit('/');
  });

  it('should load calendar and auto-select today', () => {
    cy.wait('@getAvailability');

    // Should see mobile layout
    cy.get('[data-testid="day-selector"]').should('be.visible');

    // Should auto-select today
    cy.get('[data-testid="day-selector"]').within(() => {
      cy.get('[data-selected="true"]').should('contain', 'Hoje');
    });

    // Should see single day view
    cy.get('[data-testid="day-card"]').should('have.length', 1);
  });

  it('should navigate between days using day selector', () => {
    cy.wait('@getAvailability');

    // Click next day
    cy.get('[data-testid="day-selector"]').within(() => {
      cy.get('[aria-label="Next day"]').click();
    });

    // Should update selected day
    cy.get('[data-testid="day-selector"]').within(() => {
      cy.get('[data-selected="true"]').should('not.contain', 'Hoje');
    });

    // Should update day content
    cy.get('[data-testid="day-card"]').should('contain', '16');
  });

  it('should use keyboard navigation', () => {
    cy.wait('@getAvailability');

    // Focus calendar area
    cy.get('[data-testid="calendar-container"]').focus();

    // Use arrow keys to navigate
    cy.get('body').type('{rightArrow}');

    // Should move to next day
    cy.get('[data-testid="day-selector"]').within(() => {
      cy.get('[data-selected="true"]').should('not.contain', 'Hoje');
    });

    // Use number keys
    cy.get('body').type('3');

    // Should select third day
    cy.get('[data-testid="day-selector"]').within(() => {
      cy.get('[data-selected="true"]').invoke('text').should('match', /17/);
    });
  });

  it('should book an available time slot', () => {
    cy.wait('@getAvailability');

    // Click on available time slot
    cy.get('[data-testid="time-slot"]').first().within(() => {
      cy.get('[data-available="true"]').click();
    });

    // Should trigger booking flow (mocked)
    cy.get('[data-testid="booking-modal"]').should('be.visible');
  });

  it('should handle week navigation', () => {
    cy.wait('@getAvailability');

    // Navigate to next week
    cy.get('[data-testid="week-navigation"]').within(() => {
      cy.get('[aria-label="Next week"]').click();
    });

    cy.wait('@getAvailability');

    // Should reset to first day of new week
    cy.get('[data-testid="day-selector"]').within(() => {
      cy.get('[data-selected="true"]').first().as('selectedDay');
    });

    // Use "Hoje" button to return to current week
    cy.get('[data-testid="week-navigation"]').within(() => {
      cy.get('button').contains('Hoje').click();
    });

    cy.wait('@getAvailability');

    // Should return to today
    cy.get('[data-testid="day-selector"]').within(() => {
      cy.get('[data-selected="true"]').should('contain', 'Hoje');
    });
  });
});

describe('Calendar Desktop Experience', () => {
  beforeEach(() => {
    // Set desktop viewport
    cy.viewport(1280, 720);

    cy.intercept('GET', '/appointments/availability*', {
      fixture: 'availability.json'
    }).as('getAvailability');

    cy.visit('/');
  });

  it('should display week grid on desktop', () => {
    cy.wait('@getAvailability');

    // Should see 5-day grid
    cy.get('[data-testid="week-grid"]').should('be.visible');
    cy.get('[data-testid="day-card"]').should('have.length', 5);

    // Should not show day selector on desktop
    cy.get('[data-testid="day-selector"]').should('not.exist');
  });

  it('should allow booking from any day', () => {
    cy.wait('@getAvailability');

    // Click on available slot in third day
    cy.get('[data-testid="day-card"]').eq(2).within(() => {
      cy.get('[data-available="true"]').first().click();
    });

    // Should trigger booking flow
    cy.get('[data-testid="booking-modal"]').should('be.visible');
  });
});

describe('Calendar Responsive Behavior', () => {
  it('should adapt from mobile to desktop', () => {
    // Start with mobile
    cy.viewport(375, 667);
    cy.intercept('GET', '/appointments/availability*', {
      fixture: 'availability.json'
    }).as('getAvailability');

    cy.visit('/');
    cy.wait('@getAvailability');

    // Should see mobile layout
    cy.get('[data-testid="day-selector"]').should('be.visible');
    cy.get('[data-testid="day-card"]').should('have.length', 1);

    // Resize to desktop
    cy.viewport(1280, 720);

    // Should switch to desktop layout
    cy.get('[data-testid="day-selector"]').should('not.exist');
    cy.get('[data-testid="week-grid"]').should('be.visible');
    cy.get('[data-testid="day-card"]').should('have.length', 5);
  });

  it('should adapt from desktop to mobile', () => {
    // Start with desktop
    cy.viewport(1280, 720);
    cy.intercept('GET', '/appointments/availability*', {
      fixture: 'availability.json'
    }).as('getAvailability');

    cy.visit('/');
    cy.wait('@getAvailability');

    // Should see desktop layout
    cy.get('[data-testid="week-grid"]').should('be.visible');
    cy.get('[data-testid="day-card"]').should('have.length', 5);

    // Resize to mobile
    cy.viewport(375, 667);

    // Should switch to mobile layout
    cy.get('[data-testid="day-selector"]').should('be.visible');
    cy.get('[data-testid="day-card"]').should('have.length', 1);
  });
});

describe('Calendar Performance', () => {
  it('should load quickly with large datasets', () => {
    cy.intercept('GET', '/appointments/availability*', {
      fixture: 'large-availability.json'
    }).as('getLargeAvailability');

    cy.visit('/');

    cy.wait('@getLargeAvailability');

    // Should load within performance budget
    cy.window().then((win) => {
      expect(win.performance.timing.loadEventEnd - win.performance.timing.navigationStart).to.be.lessThan(3000);
    });

    // Should be responsive after load
    cy.get('[data-testid="day-selector"]').within(() => {
      cy.get('[aria-label="Next day"]').click();
    });

    cy.get('[data-testid="day-card"]').should('be.visible');
  });
});

describe('Calendar Accessibility', () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.intercept('GET', '/appointments/availability*', {
      fixture: 'availability.json'
    }).as('getAvailability');

    cy.visit('/');
    cy.wait('@getAvailability');
  });

  it('should be keyboard navigable', () => {
    // Tab through calendar
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid', 'calendar-container');

    // Navigate with arrow keys
    cy.focused().type('{rightArrow}');
    cy.get('[data-testid="day-selector"]').within(() => {
      cy.get('[data-selected="true"]').should('not.contain', 'Hoje');
    });

    // Navigate to time slots
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'time-slot');
  });

  it('should announce changes to screen readers', () => {
    // Navigate to next day
    cy.get('[data-testid="day-selector"]').within(() => {
      cy.get('[aria-label="Next day"]').click();
    });

    // Should announce day change
    cy.get('[aria-live="polite"]').should('contain', 'Dia selecionado:');
  });
});