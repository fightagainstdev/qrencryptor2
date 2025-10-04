import { makeStyles } from "@material-ui/core/styles";
import dynamic from "next/dynamic";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import CheckMultipleTabs from "../config/CheckMultipleTabs";

const NavAppBar = dynamic(() => import("../components/AppBar"), { ssr: false });
const Panels = dynamic(() => import("../components/Panels"), { ssr: false });


const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.palette.alabaster.main,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
}))

const MainContainer = () => {

  const classes = useStyles();

  return (
    <div className={classes.body}>
      <CheckMultipleTabs />
      <NavAppBar />
      <Hero />
      <Panels />
      <Footer />
    </div>
  );
};

export default MainContainer;
