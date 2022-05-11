const handlebars=require("handlebars")
var source = 
`
import ForgeUI, {render, Macro, MacroConfig, useConfig,TextField, Form,useProductContext,Fragment,Avatar,useState,Image,CheckboxGroup,Text,Checkbox,Select,Option,Tag,DateLozenge,User,UserPicker,DatePicker
} from "@forge/ui";
  const context = useProductContext();
  {{{defaultConfig}}}


  const App = () => {
    const config = useConfig() || defaultConfig;
    const onSubmit = (formData) => {
   
      console.log(formData);
      
    }
    
  

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

{{{config}}}
`
var indexTemplate = handlebars.compile(source);
module.exports=indexTemplate;