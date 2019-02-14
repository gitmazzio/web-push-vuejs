<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld
  },
  data() {
    return {
      swRegistration: null
    };
  },
  created() {
    this.registerServiceWorker();
  },
  methods: {
    registerServiceWorker() {
      /* Method to register Service Worker.
      * Service Worker must be in your public folder. 
      */

      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker
          .register("./sw.js")
          .then(swReg => {
            console.log("Service Worker is registered", swReg);
            this.swRegistration = swReg;
            this.askPermission();
          })
          .catch(error => {
            console.error("Service worker Error", error);
          });
      } else {
        console.log("Service worker not supported.");
      }
    },
    askPermission() {
      return new Promise((resolve, reject) => {
        const permissionResult = Notification.requestPermission(result => {
          resolve(result);
        });
        if (permissionResult) {
          this.subscribeUser();
        }
      });
    },
    subscribeUser() {
      /* Method to subscribe user to browser API.
       * It return a subscription useful to send push notification. 
      */

      /* To generate publicKey read here https://web-push-codelab.glitch.me/
      or https://github.com/web-push-libs/web-push 
      */
      
      const applicationServerPublicKey = "< YOUR PUBLIC KEY >";
        //"BGkljcvoNW1b8Rabrlov28PAinTjAGgcVxBGrKVdJ9Zzc55zvsiECSXAsaQJtfUlInixNe96uUpXGNz-lrztplU";
      const applicationServerKey = this.urlB64ToUint8Array(
        applicationServerPublicKey
      );
      this.swRegistration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey
        })
        .then((subscription) => {
          console.log("User is subscribed");
          this.sendSubscription(subscription);
        })
        .catch((err) => {
          console.log("Failed to subscribe the user: ", err);
        });
    },
    sendSubscription(registration) {
      /* Method to send subscription to your server. */

      const url = "< YOUR ENDPOINT >"; //"https://webhook.site/11f16278-0a4d-4882-ab82-381779112214";
      
      let request = {
        method: "POST",
        mode: 'no-cors',
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "X-Requested-With",
        },
        body: JSON.stringify(registration)
      };
      fetch(url, request)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) =>{
        console.log(err);
      })
    },
    urlB64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
