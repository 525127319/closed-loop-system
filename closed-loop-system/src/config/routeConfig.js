"use strict";
// 路由配置页面
// 懒加载配置组件，提高渲染效率
const projectList = resolve => {
  require.ensure(["../components/projectList.vue"], () => {
    resolve(require("../components/projectList.vue"));
  });
};
const projectAdd = resolve => {
  require.ensure(["../components/projectAdd.vue"], () => {
    resolve(require("../components/projectAdd.vue"));
  });
};
const projectDetails = resolve => {
  require.ensure(["../components/projectDetails.vue"], () => {
    resolve(require("../components/projectDetails.vue"));
  });
};
const projectNewStage = resolve => {
  require.ensure(["../components/projectNewStage.vue"], () => {
    resolve(require("../components/projectNewStage.vue"));
  });
};
const projectNewSituation = resolve => {
  require.ensure(["../components/projectNewSituation.vue"], () => {
    resolve(require("../components/projectNewSituation.vue"));
  });
};
const organization = resolve => {
  require.ensure(["../childComponents/organization/parentOrg.vue"], () => {
    resolve(require("../childComponents/organization/parentOrg.vue"));
  });
};
const projectFiles = resolve => {
  require.ensure(["../components/projectFiles.vue"], () => {
    resolve(require("../components/projectFiles.vue"));
  });
};
const projectEditor = resolve => {
  require.ensure(["../components/projectEditor.vue"], () => {
    resolve(require("../components/projectEditor.vue"));
  });
};
const projectEditorStage = resolve => {
  require.ensure(["../components/projectEditorStage.vue"], () => {
    resolve(require("../components/projectEditorStage.vue"));
  });
};
const projectStageEnd = resolve => {
  require.ensure(["../components/projectStageEnd.vue"], () => {
    resolve(require("../components/projectStageEnd.vue"));
  });
};
const systemSettings = resolve => {
  require.ensure(["../components/systemSettings.vue"], () => {
    resolve(require("../components/systemSettings.vue"));
  });
};
const aboutProject = resolve => {
  require.ensure(["../components/aboutProject.vue"], () => {
    resolve(require("../components/aboutProject.vue"));
  });
};
const projectParticipant = resolve => {
  require.ensure(["../components/projectParticipant.vue"], () => {
    resolve(require("../components/projectParticipant.vue"));
  });
};
const userChart = resolve => {
  require.ensure(["../components/userChart.vue"], () => {
    resolve(require("../components/userChart.vue"));
  });
};
const deptChart = resolve => {
  require.ensure(["../components/deptChart.vue"], () => {
    resolve(require("../components/deptChart.vue"));
  });
};
const commentChart = resolve => {
  require.ensure(["../components/commentChart.vue"], () => {
    resolve(require("../components/commentChart.vue"));
  });
};
const dynamicChart = resolve => {
  require.ensure(["../components/dynamicChart.vue"], () => {
    resolve(require("../components/dynamicChart.vue"));
  });
};
const LikesChart = resolve => {
  require.ensure(["../components/LikesChart.vue"], () => {
    resolve(require("../components/LikesChart.vue"));
  });
};
const participateChart = resolve => {
  require.ensure(["../components/participateChart.vue"], () => {
    resolve(require("../components/participateChart.vue"));
  });
};



export default {
  routes: [
    {
      path: "/",
      redirect: "./ProjectList"
    },
    {
      name: "projectList",
      path: "/projectList",
      component: projectList
    },
    {
      name: "projectAdd",
      path: "/projectAdd",
      component: projectAdd
    },
    {
      name: "organization",
      path: "/parentOrg",
      component: organization
    },
    {
      name: "projectDetails",
      path: "/projectDetails",
      component: projectDetails
    },
    {
      name: "projectNewStage",
      path: "/projectNewStage",
      component: projectNewStage
    },
    {
      name: "projectNewSituation",
      path: "/projectNewSituation",
      component: projectNewSituation
    },
    {
      name: "projectFiles",
      path: "/projectFiles",
      component: projectFiles
    },
    {
      name: "projectEditor",
      path: "/projectEditor",
      component: projectEditor
    },
    {
      name: "projectEditorStage",
      path: "/projectEditorStage",
      component: projectEditorStage
    },
    {
      name: "projectStageEnd",
      path: "/projectStageEnd",
      component: projectStageEnd
    },
    {
      name: "systemSettings",
      path: "/systemSettings",
      component: systemSettings
    },
    {
      name: "aboutProject",
      path: "/aboutProject",
      component: aboutProject
    },
    {
      name: "projectParticipant",
      path: "/projectParticipant",
      component: projectParticipant
    },
    {
      name: "userChart",
      path: "/userChart",
      component: userChart
    },
    {
      name: "deptChart",
      path: "/deptChart",
      component: deptChart
    },
    {
      name: "commentChart",
      path: "/commentChart",
      component: commentChart
    },
    {
      name: "dynamicChart",
      path: "/dynamicChart",
      component: dynamicChart
    },
    {
      name: "LikesChart",
      path: "/LikesChart",
      component: LikesChart
    },
      {
      name: "participateChart",
      path: "/participateChart",
      component: participateChart
    }


    
  ]
};
