import 'https://cdnjs.cloudflare.com/ajax/libs/firebase/8.2.8/firebase-app.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/firebase/8.2.8/firebase-firestore.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/firebase/8.2.8/firebase-auth.min.js';
import 'https://www.gstatic.com/firebasejs/ui/4.7.3/firebase-ui-auth.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-zoom/0.7.7/chartjs-plugin-zoom.min.js';

import { clientId as googleAuthClientId, firebaseConfig } from './creds';

// The start method will wait until the DOM is loaded.
const initApp = () => {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // auth ui
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#firebaseui-auth-container', {
    signInSuccessUrl: '/',
    signInFlow: 'popup',
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        clientId: googleAuthClientId,
      },
    ],
    callbacks: {
      // Called when the user has been successfully signed in.
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        if (authResult.user) {
          console.log('logged in as:', authResult.user);
        }
        if (authResult.additionalUserInfo) {
          console.log('additional info:', authResult.additionalUserInfo);
        }
        // Do not redirect.
        return false;
      },
    },
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('auth success', user);

      const consumption = [];
      db.collection('oomi').get().then((q) => {
        q.forEach((doc) => {
          // console.log(doc.id, ' => ', doc.data());
          consumption.push(doc.data());
        });
      }).then(() => {
        const ctx = document.getElementById('chart').getContext('2d');
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: consumption.map((x) => (x.time.toDate())),
            datasets: [
              {
                label: 'Consumption (kWh)',
                data: consumption.map((v) => ({ x: (v.time.toDate()), y: v.consumption })),
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'time',
                distribution: 'linear',
                bounds: 'data',
              },
            },
            plugins: {
              zoom: {
                pan: {
                  enabled: true,
                  mode: 'x',
                },
                zoom: {
                  enabled: true,
                  mode: 'x',
                },
              },
            },
          },
        });
        window.resetZoom = () => chart.resetZoom();
      });
    }
  });
};

window.addEventListener('load', () => {
  initApp();
});
