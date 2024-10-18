export const layers = {
  overlays: [
    {
      type: 'folder',
      title: 'Layers',
      description: "<a href='https://geosur.info/ogcservices/rest/services/GeoSUR/GEOSUR_MIAC/MapServer' target='_blank'>Description</a>",
      expanded: true,
      regionId: 'camcar',
      folder: [
        {
          type: 'layer',
          id: '',
          name:
            'Elevaciones,Tipo de curso de agua,Curso principal de agua,Forma hidrográfica,Otro tipo de cuerpo de agua,Lagos y rios,Isla,Vía de ferrocarril,Otras carreteras,Autopista,Mancha urbana,Línea de costa,Nivel_3A,Nivel_2A,Nivel_1A,País,Etiquetas de país,Punto de interés,Punto acotado,Poblado,Topónimo',
          title: 'Mapa Integrado de América Central',
          description: '',
          source: {
            arcgis: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/GEOSUR_MIAC/MapServer',
            xyz: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/GEOSUR_MIAC/MapServer/tile/{z}/{y}/{x}',
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/GEOSUR_MIAC/MapServer/WmsServer?',
          },
          infoFormat: 'application/geojson',
          loadOnly: false,
          display: true,
          mask: false,
          zIndex: 0,
          transparency: true,
          chartIds: [],
          srs: 'EPSG:3857',
          featureInfo: {},
          style: '',
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td>Topónimo</td></tr><tr><td>N/A</td></tr>' +
              '<tr><td>Poblado</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Poblado"/></td></tr>' +
              '<tr><td>Punto acotado</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Punto acotado"/></td></tr>' +
              '<tr><td>Punto de interés</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Punto de interés"/></td></tr>' +
              '<tr><td>Etiquetas de país</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Etiquetas de país"/></td></tr>' +
              '<tr><td>País</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=País"/></td></tr>' +
              '<tr><td>Nivel_1A</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Nivel_1A"/></td></tr>' +
              '<tr><td>Nivel_2A</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Nivel_2A"/></td></tr>' +
              '<tr><td>Nivel_3A</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Nivel_3A"/></td></tr>' +
              '<tr><td>Línea de costa</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Línea de costa"/></td></tr>' +
              '<tr><td>Mancha urbana</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Mancha urbana"/></td></tr>' +
              '<tr><td>Autopista</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Autopista"/></td></tr>' +
              '<tr><td>Otras carreteras</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Otras carreteras"/></td></tr>' +
              '<tr><td>Vía de ferrocarril</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Vía de ferrocarril"/></td></tr>' +
              '<tr><td>Isla</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Isla"/></td></tr>' +
              '<tr><td>Lagos y rios</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Lagos y rios"/></td></tr>' +
              '<tr><td>Otro tipo de cuerpo de agua</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Otro tipo de cuerpo de agua"/></td></tr>' +
              '<tr><td>Forma hidrográfica</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Forma hidrográfica"/></td></tr>' +
              '<tr><td>Curso principal de agua</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Curso principal de agua"/></td></tr>' +
              '<tr><td>Tipo de curso de agua</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Tipo de curso de agua"/></td></tr>' +
              '<tr><td>Elevaciones</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Elevaciones"/></td></tr>' +
              '</table>',
            // customImageURL:
            //   'https://devgeosur.cr.usgs.gov/ogcservices/services/GeoSUR/GEOSUR_MIAS/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Topónimo',
            title: 'Mapa Integrado de América Central',
          },
        },
      ],
    },
  ],
  boundaries: [],
  baselayers: [
    {
      type: 'folder',
      title: 'Mapas Base',
      regionId: 'camcar',
      expanded: true,
      folder: [
        {
          type: 'layer',
          name: 'osm_0',
          title: 'OpenStreetMap de Transporte',
          description:
            "<p>Maps © <a href='https://www.thunderforest.com/maps/' target='_blank'>Thunderforest</a>, Data © <a href='https://www.openstreetmap.org/copyright' target='blank'>OpenStreetMap contributors</a></p><p>Thunderforest is a project by Gravitystorm Limited.</p>",
          loadOnly: false,
          display: true,
          mask: false,
          srs: 'EPSG:3857',
          loaded: 'true',
          brand: 'osm',
          source: {
            url: 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6a016c81411f47cf996ecf50d662545c',
          },
          comments: '',
        },
        {
          type: 'layer',
          name: 'osm_0',
          title: 'OpenStreetMap Estándar',
          description: "<p>© <a href='https://www.openstreetmap.org/copyright' target='blank'>OpenStreetMap contributors</a></p>",
          loadOnly: false,
          display: false,
          mask: false,
          srs: 'EPSG:3857',
          loaded: 'true',
          brand: 'osm',
          source: {},
          comments: '',
        },
      ],
    },
  ],
};
