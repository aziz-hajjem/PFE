const manifest=(project)=>{
    const dataManifest = `
    modules:
    ${
      project.macros.length
        ? `
     macro:`
        : ""
    }
       ${project.macros
         .map(
           (el) =>
             `
      - key: ${el.key.split(' ').join('-')}
        function: ${el.name.split(' ').join("-")}
        title: ${el.name.split(' ').join("-")}
        description: ${el.description}
        ${(el.text||el.tag)?(`
        config:
          function: ${el.name.split(' ').join("-")}-config`):""}
        `
         )
         .join("")}
      ${
        project.spaceSettings.length
          ? `
     confluence:spaceSettings:`
          : ""
      }
      ${project.spaceSettings
        .map(
          (el) =>
            `
      - key: ${el.key.split(' ').join('-')}
        function: ${el.name.split(' ').join("-")}
        title: ${el.name.split(' ').join("-")}
        description: ${el.description}

        `
        )
        .join("")}
      ${
        project.spacePages.length
          ? `
     confluence:spacePage:`
          : ""
      }
      ${project.spacePages
        .map(
          (el) =>
            `
      - key: ${el.key.split(' ').join('-')}
        function: ${el.name.split(' ').join("-")}
        title: ${el.name.split(' ').join("-")}
        route: ${(el.name.split(' ').join("-")).toLowerCase()}

      `
        )
        .join("")}

        ${
          project.globalSettings.length
            ? `
     confluence:globalSettings:`
            : ""
        }
        ${project.globalSettings
          .map(
            (el) =>
              `
      - key: ${el.key.split(' ').join('-')}
        function: ${el.name.split(' ').join("-")}
        title: ${el.name.split(' ').join("-")}
        description: ${el.description}
  
        `
          )
          .join("")}
          ${
            project.globalPages.length
              ? `
     confluence:globalPage:`
              : ""
          }
          ${project.globalPages
            .map(
              (el) =>
                `
      - key: ${el.key.split(' ').join('-')}
        function: ${el.name.split(' ').join("-")}
        title: ${el.name.split(' ').join("-")}
        route: ${(el.name.split(' ').join("-")).toLowerCase()}
    
          `
            )
            .join("")}                
    ${
      project.homePageFeeds.length
        ? `
     confluence:homepageFeed:`
        : ""
    }
    ${project.homePageFeeds
      .map(
        (el) =>
          `
      - key: ${el.key.split(' ').join('-')}
        function: ${el.name.split(' ').join("-")}
        title: ${el.name.split(' ').join("-")}
        description: ${el.description}

    `
      )
      .join("")}
      ${
        project.contextMenu.length
          ? `
     confluence:contextMenu:`
          : ""
      }
      ${project.contextMenu
        .map(
          (el) =>
            `
      - key: ${el.key.split(' ').join('-')}
        function: ${el.name.split(' ').join("-")}
        title: ${el.name.split(' ').join("-")}
  
      `
        )
        .join("")}
        ${
          project.contentByLineItems.length
            ? `
     confluence:contentBylineItem:`
            : ""
        }
        ${project.contentByLineItems
          .map(
            (el) =>
              `
      - key: ${el.key.split(' ').join('-')}
        function: ${el.name.split(' ').join("-")}
        title: ${el.name.split(' ').join("-")}
        tooltip: ${el.tooltip}
        description: ${el.description}
        `
          )
          .join("")}
          ${
            project.contentActions.length
              ? `
     confluence:contentAction:`
              : ""
          }
          ${project.contentActions
            .map(
              (el) =>
                `
      - key: ${el.key.split(' ').join('-')}
        function: ${el.name.split(' ').join("-")}
        title: ${el.name.split(' ').join("-")}
          `
            )
            .join("")}
          
      
     function:
     ${project.macros
       .map(
         (el) =>
           `
      - key: ${el.name.split(' ').join("-")}
        handler: ${el.name.split(' ').join("-")}.run
        ${(el.text||el.tag)?(`
      - key: ${el.name.split(' ').join("-")}-config
        handler: ${el.name.split(' ').join("-")}.config`):""}

      `
       )
       .join("")}
    ${project.spaceSettings
      .map(
        (el) =>
          `
      - key: ${el.name.split(' ').join("-")}
        handler: ${el.name.split(' ').join("-")}.run

      `
      )
      .join("")}
    ${project.spacePages
      .map(
        (el) =>
          `
      - key: ${el.name.split(' ').join("-")}
        handler: ${el.name.split(' ').join("-")}.run

      `
      )
      .join("")}
    ${project.homePageFeeds
      .map(
        (el) =>
          `
      - key: ${el.name.split(' ').join("-")}
        handler: ${el.name.split(' ').join("-")}.run

      `
      )
      .join("")}
      ${project.globalSettings
        .map(
          (el) =>
            `
      - key: ${el.name.split(' ').join("-")}
        handler: ${el.name.split(' ').join("-")}.run
  
        `
        )
        .join("")}
        ${project.globalPages
          .map(
            (el) =>
              `
      - key: ${el.name.split(' ').join("-")}
        handler: ${el.name.split(' ').join("-")}.run
    
          `
          )
          .join("")}
          ${project.contextMenu
            .map(
              (el) =>
                `
      - key: ${el.name.split(' ').join("-")}
        handler: ${el.name.split(' ').join("-")}.run
      
            `
            )
            .join("")}
            ${project.contentByLineItems
              .map(
                (el) =>
                  `
      - key: ${el.name.split(' ').join("-")}
        handler: ${el.name.split(' ').join("-")}.run
        
              `
              )
              .join("")}
              ${project.contentActions
                .map(
                  (el) =>
                    `
      - key: ${el.name.split(' ').join("-")}
        handler: ${el.name.split(' ').join("-")}.run
          
                `
                )
                .join("")}
    app:
      id: 'Please run forge register'
    `;
    return dataManifest;
}






module.exports=manifest