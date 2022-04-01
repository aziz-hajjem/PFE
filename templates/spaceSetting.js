const handlebars=require("handlebars")
var source = 
`
import ForgeUI, { render, Form, TextField, SpaceSettings,useProductContext,Fragment,Avatar,useState,Image,CheckboxGroup,Text,Checkbox,Select,Option,Tag,DateLozenge    } from '@forge/ui';

const App = () => {
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
  <SpaceSettings>
    <App />
  </SpaceSettings>
);
`
var spaceSettingsTemplate = handlebars.compile(source);
module.exports=spaceSettingsTemplate;