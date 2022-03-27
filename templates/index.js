const handlebars=require("handlebars")
var source = 
`
import ForgeUI, { render, Fragment, Macro, Text, MacroConfig, useConfig,Tag,TextField
} from "@forge/ui";

const defaultConfig = {
  {{{defaultConfig}}}
};

  const App = () => {
    const config = useConfig() || defaultConfig;

    return (
     <Fragment>
       {{{data}}} 
     </Fragment>
    );
};

export const run = render(
  <Macro
    app={<App />}
  />
);


const Config = () => {
  return (
    <MacroConfig>
      {{{config}}}
    </MacroConfig>
  );
};

export const config = render(<Config />);
`
var indexTemplate = handlebars.compile(source);
module.exports=indexTemplate;