import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // ডাটাবেস অডাপ্টার সরিয়ে এখানে 'memory' ব্যবহার করা হয়েছে
  database: {
    type: "memory", 
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
});