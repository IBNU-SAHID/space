<template>
  <div class="w-full h-screen flex">
    <div class="flex flex-row items-center w-screen" >
      <div class="basis-1/3">
        <img src="../assets/astro.png" class="w-[400px] h-[400px]" >
      </div>
      <div class="basis 2/3">
        <div class="relative mb-1 flex flex-row">
          <div class="basis-1/4">
            <h2 class="text-4xl font-bold text-white text-center">Space</h2>
          </div>
          <div class="basis-3/4">
            <input type="search" v-model="username" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-r-lg mb-1 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Username" required />
          </div>

        </div>
        <div class="">
          <div
              id="chat-box"
              class="max-h-[400px] w-[800px] max-w-[800px] rounded"
              style="background-color: rgba(255, 255, 255, 0.35); overflow-y: scroll; border: 1px solid black; padding: 10px;">
            <!-- Loop through messages and display them -->
            <div v-for="(msg, index) in messages" :key="index">
              <div v-if="msg.username !== username" class="bg-white p-2 mb-2 rounded w-[600px]">
                <div class="flex">
                  <div class="mr-1">
                   <img class="w-10 h-10 mx-auto" src="../assets/avatar.png">
                  </div>
                  <div>
                    <p><strong>{{ msg.username }}</strong></p>
                    {{ msg.content }}
                  </div>
                </div>
              </div>
              <div v-else class="bg-green-400 p-2 mb-2 rounded w-[600px] ml-auto">
                <p><strong>{{ msg.username }}</strong></p>
                {{ msg.content }}
              </div>
            </div>

          </div>
          <div class="relative mt-1">
            <input type="search" v-model="message" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Send Message" required />
            <button @click="sendMessage" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
import cable from "actioncable"
import axios from "axios";

export default {
  data() {
    return {
      username: `astro-${Math.floor(Math.random() * 1000)}`, // Random username
      message: "",
      messages: [], // Array to hold messages
      cable: null, // ActionCable consumer
      channel: null, // Channel for communication
    };
  },
  mounted() {
    this.connectToChat(); // Connect to the WebSocket when the component is mounted
    this.fetchMessages(); // Fetch existing messages
  },
  methods: {
    async connectToChat() {
      this.cable = cable.createConsumer("ws://localhost:3000/cable");


      this.channel = this.cable.subscriptions.create(
          { channel: "ChatroomChannel" },
          {
            received: (data) => {
              console.log("Received message from server:", data);
              this.messages.push(data.message);
            },
            connected: () => {
              console.log("WebSocket connected to ChatroomChannel!");
            },
            disconnected: () => {
              console.log("WebSocket disconnected!");
            },
            rejected: () => {
              console.error("WebSocket subscription rejected!");
            },
          }
      );


    },

    async fetchMessages() {
      try {
        const response = await axios.get("http://localhost:3000/messages");
        console.log("Fetched messages:", response.data); // Log struktur data yang diambil
        this.messages = response.data; // Set the messages array
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },

    async sendMessage() {
      try {
        await axios.post("http://localhost:3000/messages", {
          username: this.username,
          content: this.message,
        });
        this.message = ""; // Clear the message input after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
  },
};
</script>
