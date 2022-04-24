const handlebars=require("handlebars")
var source = 
`
import ForgeUI, { render, Form, TextField, GlobalPage,useProductContext,Fragment,Avatar,useState,Image,CheckboxGroup,Text,Checkbox,Select,Option,Tag,DateLozenge,User    } from '@forge/ui';

const App = () => {
  const onSubmit = (formData) => {
   
    console.log(formData);
    
  }
  const context = useProductContext();

  return (
    <Fragment>
    {{{data}}}
    </Fragment>
  );
};

export const run = render(
    <GlobalPage>
      <App />
    </GlobalPage>
);
`
var globalPageTemplate = handlebars.compile(source);
module.exports=globalPageTemplate;