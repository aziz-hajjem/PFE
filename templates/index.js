const handlebars=require("handlebars")
var source = 
`
import ForgeUI, { render, Fragment, Macro, Text } from "@forge/ui";

  const App = () => {
    return (
     <Fragment>
       <Text>{{projectName}} {{projectDescription}} </Text>
     </Fragment>
    );
};

export const run = render(
  <Macro
    app={<App />}
  />
);
`
var indexTemplate = handlebars.compile(source);
module.exports=indexTemplate;