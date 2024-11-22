import { createConsumer } from "actioncable";

this.cable = createConsumer("ws://localhost:3000/cable");
export default cable;
