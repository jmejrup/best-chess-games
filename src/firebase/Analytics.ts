import { getAnalytics } from "firebase/analytics";
import { app } from "./Firebase";

export const analytics = getAnalytics(app);