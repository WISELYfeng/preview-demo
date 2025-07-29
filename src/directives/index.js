import scrollRestore from './scrollRestore';

const importDirective = app => {
  app.directive('scrollRestore', scrollRestore);
};

export default importDirective;
