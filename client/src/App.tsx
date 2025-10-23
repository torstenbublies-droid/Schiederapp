import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import News from "./pages/News";
import Events from "./pages/Events";
import Departments from "./pages/Departments";
import IssueReports from "./pages/IssueReports";
import Waste from "./pages/Waste";
import Alerts from "./pages/Alerts";
import Tourism from "./pages/Tourism";
import Education from "./pages/Education";
import Business from "./pages/Business";
import Clubs from "./pages/Clubs";
import Council from "./pages/Council";
import Services from "./pages/Services";
import ServiceTermine from "./pages/ServiceTermine";
import ServiceMeldebescheinigung from "./pages/ServiceMeldebescheinigung";
import ServiceHundesteuer from "./pages/ServiceHundesteuer";
import ServiceFuehrungszeugnis from "./pages/ServiceFuehrungszeugnis";
import ServiceBauen from "./pages/ServiceBauen";
import ServiceGewerbe from "./pages/ServiceGewerbe";
import Contact from "./pages/Contact";
import AdminContact from "./pages/AdminContact";
import AdminNotifications from "./pages/AdminNotifications";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/news"} component={News} />
      <Route path={"/events"} component={Events} />
      <Route path={"/departments"} component={Departments} />
      <Route path={"/services"} component={Services} />
      <Route path={"/service/termine"} component={ServiceTermine} />
      <Route path={"/service/meldebescheinigung"} component={ServiceMeldebescheinigung} />
      <Route path={"/service/hundesteuer"} component={ServiceHundesteuer} />
      <Route path={"/service/fuehrungszeugnis"} component={ServiceFuehrungszeugnis} />
      <Route path={"/service/bauen"} component={ServiceBauen} />
      <Route path={"/service/gewerbe"} component={ServiceGewerbe} />
      <Route path={"/issues"} component={IssueReports} />
      <Route path={"/waste"} component={Waste} />
      <Route path={"/alerts"} component={Alerts} />
      <Route path={"/tourism"} component={Tourism} />
      <Route path={"/education"} component={Education} />
      <Route path={"/business"} component={Business} />
      <Route path={"/clubs"} component={Clubs} />
      <Route path={"/council"} component={Council} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/admin/contact"} component={AdminContact} />
      <Route path={"/admin/notifications"} component={AdminNotifications} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

