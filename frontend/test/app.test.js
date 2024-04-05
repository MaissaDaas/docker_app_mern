const assert = require('assert');
const { JSDOM } = require('jsdom');
const React = require('react');
const ReactDOM = require('react-dom');
const { act } = require('react-dom/test-utils');
const App = require('../src/App').default; // Notez l'utilisation de .default
import React, { useState, useEffect } from 'react'

// Fonction utilitaire pour créer une instance du composant App
function createApp() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  act(() => {
    ReactDOM.render(React.createElement(App), div);
  });
  return div;
}

// Test de rendu initial du composant App
describe('App component', () => {
  it('renders without crashing', () => {
    createApp();
  });

  it('renders employee list table', () => {
    const div = createApp();
    const table = div.querySelector('.ant-table');
    assert(table !== null);
  });

  it('updates form fields on input change', () => {
    const div = createApp();
    const nameInput = div.querySelector('input[name="name"]');
    const emailInput = div.querySelector('input[name="email"]');
    const roleInput = div.querySelector('input[name="role"]');

    act(() => {
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      roleInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    assert.strictEqual(nameInput.value, '');
    assert.strictEqual(emailInput.value, '');
    assert.strictEqual(roleInput.value, '');
  });

  // Vous pouvez ajouter d'autres tests pour handleSubmit, handleDelete, etc.
});

// Exécuter les tests
if (typeof describe === 'function') {
  describe('App', () => {
    it('renders without crashing', () => {
      createApp();
    });
  });
}
