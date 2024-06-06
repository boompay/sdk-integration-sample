export type EmittedEvent = AnalyticsEvent | ActionEvent;

// PageIdentifier -- page name
// PageIdentifier gonna be registered as enum later
type PageIdentifier = string;

type AnalyticsEvent = {
  type: "analytics";
  action: "pageview" | "click";
  source: PageIdentifier;
  message?: string;
};

type ActionEvent = {
  type: "action";
  action: "close" | "auth-error" | "plaid_link_handoff";
  source?: PageIdentifier;
  message?: string;
};

export enum View {
  Home = "home",
  SDK = "sdk",
  Plaid = "plaid",
}
