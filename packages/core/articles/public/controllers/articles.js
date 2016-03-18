'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Global', 'Articles', 'MeanUser', 'Circles', '$filter', '$http', 'wizMarkdownSvc', '$sce',
  function($scope, $stateParams, $location, Global, Articles, MeanUser, Circles, $filter, $http, wizMarkdownSvc, $sce) {
    $scope.global = Global;
    var orderBy = $filter('orderBy');

    setTimeout(function () {
    console.log($.fn.toPinyin('UI 设计师'));

    }, 1000);

    $scope.hasAuthorization = function(article) {
      if (!article || !article.user) return false;
      return MeanUser.isAdmin || article.user._id === MeanUser.user._id;
    };

    $scope.availableCircles = [];

    $scope.addressList = [
      {
        'name': '北京 - 望京',
        'slug': 'bj-wangjing'
      }, {
        name: '北京 - 亦庄',
        'slug': 'bj-yizhuang'
      }
    ];

    $scope.statusList = [
      {
        'name': '热门',
        'slug': 'new'
      }, {
        name: '普通',
        'slug': 'normal'
      }
    ];

    $scope.categoryList = [
      {
        'name': '产品',
        'slug': 'chan-pin',
        'orderId': 1
      },
      {
        name: '设计',
        'slug': 'she-ji',
        'orderId': 2
      },
      {
        name: '市场',
        'slug': 'shi-chang',
        'orderId': 3
      },
      {
        name: '销售',
        'slug': 'xiao-shou',
        'orderId': 4
      },
      {
        name: '硬件研发',
        'slug': 'ying-jian-yan-fa',
        'orderId': 5
      },
      {
        name: '软件研发',
        'slug': 'ruan-jian-yan-fa',
        'orderId': 6
      },
      {
        name: '财务',
        'slug': 'cai-wu',
        'orderId': 7
      },
      {
        name: '行政',
        'slug': 'xing-zheng',
        'orderId': 8
      },
      {
        name: '售后',
        'slug': 'shou-hou',
        'orderId': 9
      },
      {
        name: '客服',
        'slug': 'ke-fu',
        'orderId': 10
      },
      {
        name: '商务',
        'slug': 'shang-wu',
        'orderId': 11
      },

    ];

    $scope.categoryListAll = [{
                'name': '全部职能',
                'slug': 'all',
                'orderId': 0
    }].concat($scope.categoryList)
    // console.log($scope.categoryListAll);
    

    if (!angular.isObject($scope.article)) {
      $scope.article = {};
      $scope.article.title = '';
    }

    $scope.blurTitleSlug = function () {
      if (!!$scope.article.title && !$scope.article.title_slug) {
        $scope.article.title_slug = $.fn.toPinyin($scope.article.title);
      }
    }

    $scope.setTitleSlug = function () {
        $scope.article.title_slug = $.fn.toPinyin($scope.article.title);
    };

    // $scope.article.title_slug = $scope.article.title.toLowerCase();


    $scope.selectAddress = function () {
    }

    // $scope.showAddresses = function () {

    // }

    Circles.mine(function(acl) {
        $scope.availableCircles = acl.allowed;
        $scope.allDescendants = acl.descendants;
    });

    $scope.showDescendants = function(permission) {
        var temp = $('.ui-select-container .btn-primary').text().split(' ');
        temp.shift(); //remove close icon
        var selected = temp.join(' ');
        $scope.descendants = $scope.allDescendants[selected];
    };

    $scope.selectPermission = function() {
        $scope.descendants = [];
    };

    $scope.articleSortUpdate = false;

    // 职位排序 设置 id
    $scope.listSortConfig = {
        onUpdate: function (/** ngSortEvent */event){
          $scope.articleList = [];

          $scope.articleSortUpdate = true;

          var articleLength = event.models.length;
          angular.forEach(event.models, function (article, index) {
            article.sort_id = articleLength - index;
            $scope.articleList.push(article);
          });
            // @see https://github.com/RubaXa/Sortable/blob/master/ng-sortable.js#L18-L24
        }
    };

    // 筛选显示的职能 职位
    $scope.categorySelected = 'all';
    $scope.listCategoryShow = function (slug) {

      $scope.categorySelected = slug;

      // console.log(slug, $scope.categorySelected);

    };
    

    $scope.saveListSort = function () {
      var i = 0;
      var tmpErrArr = [];
      if ($scope.articleSortUpdate) {
        angular.forEach($scope.articleList,function (article, index) {
          if (!article.updated) {
            article.updated = [];
          }
          article.updated.push(new Date().getTime());

          var article = new Articles(article);

          console.log('文章', article)

          $http.put('/api/article/sortbyid/' + article._id, article)
          .success(function (msg) {
            console.log('成功');
          })
          .error(function (err) {
            console.log(err);
          });


          // article.$update(function() {
          //   // $location.path('articles/' + article._id);
          // });

          i++;

          if (index == $scope.articleList.length - 1) {
          }

        });

        if (i == $scope.articleList.length) {
          $scope.articleSortUpdate = false;
          $scope.articleList = [];
          $scope.changeAlert('排序成功', 'alert-info');
          // $scope.articles = angular.extend({}, $scope.articleList);
        } else {
          $scope.changeAlert('排序失败', 'alert-warning');

        }


      } else {
      }
    };

    $scope.changeAlert = function (text, className) {
      className = className || '';
      $scope.alert = {
        text: text,
        class: className
      }
    }

    $scope.jsonToMd = function (content) {
      var content = content || '';
      content = textAutoSpace(content);
      content = wizMarkdownSvc.Transform(content);
      var $content = $('<div>' + content + '</div>');

      $content.find('h3').each(function () {
        var index = $(this).index();
        if (!index) {
          $(this).before('<!--<div class=\"jobblock\">-->');
        } else {
          $(this).before('<!--</div><div class=\"jobblock\">-->');
        }
      });
      $content.append('<!--</div>-->');

      $content.html($content.html().replace(/<!--([<>\w\s=\/\\"]+)-->/gi, function ($0, $1) {
        return $1.replace('jobblock', 'job-block');
      }));
        // console.log($content);

      return $content.html();
    };

    $scope.exportListSort = function () {
      if ($scope.articleSortUpdate) {
        $scope.changeAlert('存在排序，不可以导出为数据', 'alert-warning');
        // console.log(1);
        return;
      }

      var tmpJSON = [];

      var titleSlugTo = function (str) {
        return str.replace('-chan-pin-jing-li', '-pm')
          .replace('-kai-fa-gong-cheng-shi', '-developer')
          .replace('-gong-cheng-shi', '-developer')
          .replace('-yun-ying-jing-li', '-om')
          .replace('-yun-ying-zhuan-yuan', '-os')
          .replace('-fen-xi-shi', '-analysts')
      }
      angular.forEach($scope.articles, function (article, index) {
        var enReg = new RegExp("[a-zA-Z0-9-]");
        var tmp = {
          title: article.title,
          titleFirstEn: enReg.test(article.title.substr(0, 1)) ? 0: 1,
          titleSlug: article.title_slug,
          titleSlugTo: titleSlugTo(article.title_slug),
          sort_id: article.sort_id,
          category: article.category.name,
          categorySlug: article.category.slug,
          address: article.address.name,
          addressSlug: article.address.slug,
          status: article.status.slug,
          body: $scope.jsonToMd(article.content)
        }
        tmpJSON.push(tmp);
      });

      $scope.exportJSON = tmpJSON;//JSON.stringify(tmpJSON);

      var top = $('#exportJSON').offset().top - 60;

        $("body").animate({
            scrollTop: top
        }, 100, function () {

        });



    };


    $scope.create = function(isValid) {
      if (isValid) {
        // $scope.article.permissions.push('test test');
        $scope.article.sort_id = 1;
        var article = new Articles($scope.article);

        article.$save(function(response) {
          $location.path('articles/' + response._id);
        });

        $scope.article = {};

      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(article) {
      var returnValue = confirm("删除是不可恢复的，你确认要删除该职位吗？");
      if (!returnValue) {
        return;
      }
      if (article) {
        article.$remove(function(response) {
          for (var i in $scope.articles) {
            if ($scope.articles[i] === article) {
              $scope.articles.splice(i, 1);
            }
          }
          $location.path('articles');
        });
      } else {
        $scope.article.$remove(function(response) {
          $location.path('articles');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var article = $scope.article;
        if (!article.updated) {
          article.updated = [];
        }
        article.updated.push(new Date().getTime());

        article.$update(function() {
          $location.path('articles/' + article._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Articles.query(function(articles) {

        $scope.articles = orderBy(articles, ['sort_id'], true);
      });
    };

    $scope.getContentHTML = function (content) {
      // content = textAutoSpace(textAutoSpace);
      return $sce.trustAsHtml($scope.jsonToMd(content));
    };

    $scope.findOne = function() {
      Articles.get({
        articleId: $stateParams.articleId
      }, function(article) {
        // article.articleContentHTML = $sce.trustAsHtml($scope.jsonToMd(article.content));
        $scope.article = article;
      });
    };
  }
]);