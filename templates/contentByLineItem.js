const handlebars = require("handlebars");
var source = `
import ForgeUI, { render, Form, TextField,ContentBylineItem,InlineDialog,useProductContext,Fragment,Avatar,useState,Image,CheckboxGroup,Text,Checkbox,Select,Option,Tag,DateLozenge,User    } from '@forge/ui';

const App = () => {
  const onSubmit = (formData) => {
   
    console.log(formData);
    
  }
  const context = useProductContext();

  return (
    <InlineDialog>
    {{{data}}}
    </InlineDialog>
  );
};

export const run = render(
    <ContentBylineItem>
      <App />
    </ContentBylineItem>
);
`;
var contentByLineItemTemplate = handlebars.compile(source);
module.exports = contentByLineItemTemplate;
