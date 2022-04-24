const handlebars=require("handlebars")
var source = 
`
import ForgeUI, { render, Form, TextField, SpacePage,useProductContext,Fragment,Avatar,useState,Image,CheckboxGroup,Text,Checkbox,Select,Option,Tag,DateLozenge,User    } from '@forge/ui';

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
    <SpacePage>
      <App />
    </SpacePage>
);
`
var spacePagesTemplate = handlebars.compile(source);
module.exports=spacePagesTemplate;