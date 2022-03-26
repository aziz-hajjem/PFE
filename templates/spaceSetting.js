const handlebars=require("handlebars")
var source = 
`
import ForgeUI, { render, Form, TextField, SpaceSettings } from '@forge/ui';

const App = () => {
  const onSubmit = (formData) => {
    console.log(formData);
  }

  return (
    <Form onSubmit={onSubmit}>
      <TextField name="{{spaceName}}" label="{{spaceLabel}}!" />
    </Form>
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