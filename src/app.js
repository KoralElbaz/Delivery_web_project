//import
const express = require('express');
const app = express();
const path = require('path');
const bigml = require('bigml');
const AssociationSet = require('bigml/lib/AssociationSet');
const {data1, prods, sizeForChart} = require("./help_function/myLibrary");
const connection = new bigml.BigML('koral7elbaz', '0530e18185855693acb320de6a260539c9931aec');

// Static Files
app.use(express.static(path.join(__dirname, 'public')));


//set Views
// app.set('views', './views')
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render("pages/dashboard", data1)
})


app.get('/bigml', (req, res) => {
    res.render('pages/Analytical_Views')
})
app.get('/predictBIGML', (req, res) => {
    const source = new bigml.Source(connection);
    source.create('./output.csv', { name: 'my test' }, true,
        function (error, sourceInfo) {
            if (!error && sourceInfo) {
                const dataset = new bigml.Dataset(connection);
                dataset.create(sourceInfo, null, true, function (error, datasetInfo) {
                    if (!error && datasetInfo) {
                        if (!error && datasetInfo) {
                            const association = new bigml.Association(connection);
                            association.create(datasetInfo, { name: 'Kettle' }, true, function (error, associationInfo) {
                                if (!error && associationInfo) {

                                    const model = new bigml.Model(connection);
                                    const results = {};
                                    results.data = [];
                                    model.get(associationInfo.resource, true, 'only_model=true;limit=-1', function (error, modelInfo) {
                                        if (!error && modelInfo) {
                                         
                                           for (let i = 0; i < modelInfo.object.associations.rules.length; i++) {

                                                var src = modelInfo.object.associations.rules[i].lhs_cover[1]
                                                var dest = modelInfo.object.associations.rules[i].rhs_cover[1]
                                                var src_name = modelInfo.object.associations.items.find((item) => item.count === src).name
                                                var dest_name = modelInfo.object.associations.items.find((item) => item.count === dest).name
                                                var support = (modelInfo.object.associations.rules[i].support[0] * 100) + '%'
                                                var coverage = (modelInfo.object.associations.rules[i].lhs_cover[0] * 100) + '%'

                                                results.data.push({
                                                    product: src_name,
                                                    items: [dest_name],
                                                    support: support,
                                                    coverage: coverage
                                                });

                                               

                                           }
                                           console.log("Done bigml!")
                                            res.json(results);
                                        }
                                    });


                                }
                            });
                        }
                    }
                })
            }
        });

})


module.exports = app;