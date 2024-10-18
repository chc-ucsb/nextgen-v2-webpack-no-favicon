export const layers = {
  overlays: [
    {
      type: 'folder',
      title: 'Layers',
      description: "<a href='https://geosur.info/ogcservices/rest/services/GeoSUR/GEOSUR_MIAC/MapServer' target='_blank'>Description</a>",
      expanded: true,
      regionId: 'sa',
      folder: [
        {
          type: 'layer',
          id: '',
          name: '0',
          title: 'Mediciones de Caudal',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/GeoSUR_River_Watch_Sites/MapServer/WMSServer?',
          },
          infoFormat: 'application/geojson',
          loadOnly: false,
          display: true,
          mask: false,
          zIndex: 0,
          transparency: true,
          chartIds: [],
          srs: 'EPSG:3857',
          featureInfo: {
            SiteID: {
              displayName: 'ID',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Date: {
              displayName: 'Fecha',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Rivername: {
              displayName: 'Río',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Country: {
              displayName: 'País',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            FlowStatus: {
              displayName: 'Circulación',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Runoff: {
              displayName: 'Escorrentía (%)',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            URL: {
              displayName: 'URL',
              displayValue: null,
              value: null,
              mapValues: [],
            },
          },
          style: '',
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td>Nivel de Inundación</td></tr><tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/GeoSUR_River_Watch_Sites/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'Mediciones de Caudal',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0,1,2,3,4,5',
          title: 'Hidrografía de Suramérica',
          description: '',
          source: {
            arcgis: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/Hidrografia/MapServer/WMSServer',
            xyz: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/Hidrografia/MapServer/tile/{z}/{y}/{x}',
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/Hidrografia/MapServer/WMSServer?',
          },
          infoFormat: 'application/geojson',
          loadOnly: false,
          display: false,
          mask: false,
          zIndex: 0,
          transparency: true,
          chartIds: [],
          srs: 'EPSG:3857',
          // featureInfo: {},
          style: '',
          opacity: 0.7,
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/Hidrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=5"/></td><td>Hidrografia</td></tr>' +
              '<tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/Hidrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=4"/></td><td>Lagos y rios principales</td></tr>' +
              '<tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/Hidrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=3"/></td><td>Cuerpos de agua</td></tr>' +
              '<tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/Hidrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=2"/></td><td>Cuencas Nivel 1</td></tr>' +
              '<tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/Hidrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1"/></td><td>Cuencas Nivel 2</td></tr>' +
              '<table><tr><td>Cuencas Nivel 3</td></tr><tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/Hidrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'Hidrografía de Suramérica',
          },
        },

        {
          type: 'layer',
          id: '',
          name: 'SA_2wk_rs:DFO_2wk_current_SA',
          title: 'Inundación en Curso (2 Semanas) (DFO)',
          description: '',
          source: {
            wms: 'https://floodobservatory.colorado.edu/geoserver/SA_2wk_rs/wms?',
          },
          infoFormat: 'application/json',
          loadOnly: false,
          display: true,
          mask: false,
          zIndex: 0,
          transparency: true,
          chartIds: [],
          srs: 'EPSG:3857',
          // featureInfo: {},
          style: '',
          legend: {
            style: '',
            customImageURL:
              'https://floodobservatory.colorado.edu/geoserver/SA_2wk_rs/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=2wk_040w000s',
            title: 'Inundación en Curso (2 Semanas) (DFO)',
          },
        },

        {
          type: 'layer',
          id: '',
          name: 'DFO_rs_Jan_till_current_SA:DFO_Jan_till_current_SA',
          title: 'Inundación en Curso desde Enero (DFO)',
          description: '',
          source: {
            wms: 'https://floodobservatory.colorado.edu/geoserver/DFO_rs_Jan_till_current_SA/wms?',
          },
          infoFormat: 'application/json',
          loadOnly: false,
          display: true,
          mask: false,
          zIndex: 0,
          transparency: true,
          chartIds: [],
          srs: 'EPSG:3857',
          // featureInfo: {},
          style: '',
          legend: {
            style: '',
            customImageURL:
              'https://floodobservatory.colorado.edu/geoserver/DFO_rs_Jan_till_current_SA/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=Jan%20till%20Current%20040w000s',
            title: 'Inundación en Curso desde Enero (DFO)',
          },
        },

        {
          type: 'layer',
          id: '',
          name: 'Elevaciones,Tipo de curso de agua,Curso principal de agua,Forma hidrográfica,Otro tipo de cuerpo de agua,Lagos y rios,Isla',
          title: 'Hidrografía del Mapa Integrado de América Central',
          description: '',
          source: {
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
          // featureInfo: {},
          style: '',
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td>Isla</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Isla"/></td></tr>' +
              '<tr><td>Lagos y rios</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Lagos y rios"/></td></tr>' +
              '<tr><td>Otro tipo de cuerpo de agua</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Otro tipo de cuerpo de agua"/></td></tr>' +
              '<tr><td>Forma hidrográfica</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Forma hidrográfica"/></td></tr>' +
              '<tr><td>Curso principal de agua</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Curso principal de agua"/></td></tr>' +
              '<tr><td>Tipo de curso de agua</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Tipo de curso de agua"/></td></tr>' +
              '<tr><td>Elevaciones</td></tr><tr><td><img src="https://www.geosur.info/arcgis/services/GeoSUR/GEOSUR_MIAC/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Elevaciones"/></td></tr>' +
              '</table>',
            title: 'Hidrografía del Mapa Integrado de América Central',
          },
        },

        {
          type: 'layer',
          id: '',
          name: 'Lagos y rios,Otro tipo de cuerpo de agua,Forma hidrográfica,Curso principal de agua,Tipo de curso de agua,Elevaciones,Isla',
          title: 'Hidrografía del Mapa Integrado de América del Sur',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/GEOSUR_MIAS/MapServer/WMSServer?',
          },
          infoFormat: 'application/geojson',
          loadOnly: false,
          display: true,
          mask: false,
          zIndex: 0,
          transparency: true,
          chartIds: [],
          srs: 'EPSG:3857',
          // featureInfo: {},
          style: '',
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td>Lagos y rios</td></tr><tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/GEOSUR_MIAS/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Lagos y rios"/></td></tr>' +
              '<tr><td>Otro tipo de cuerpo de agua</td></tr><tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/GEOSUR_MIAS/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Otro tipo de cuerpo de agua"/></td></tr>' +
              '<tr><td>Forma hidrográfica</td></tr><tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/GEOSUR_MIAS/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Forma hidrográfica"/></td></tr>' +
              '<tr><td>Curso principal de agua</td></tr><tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/GEOSUR_MIAS/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Curso principal de agua"/></td></tr>' +
              '<tr><td>Tipo de curso de agua</td></tr><tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/GEOSUR_MIAS/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Tipo de curso de agua"/></td></tr>' +
              '</table>',
            title: 'Hidrografía del Mapa Integrado de América del Sur',
          },
        },
      ],
    },
  ],
  boundaries: [],
  baselayers: [
    {
      type: 'folder',
      title: 'Basemaps',
      regionId: 'sa',
      expanded: true,
      folder: [
        {
          type: 'layer',
          name: 'osm_0',
          title: 'Transport OpenStreetMap',
          description:
            "<p>Maps © <a href='https://www.thunderforest.com/maps/' target='_blank'>Thunderforest</a>, Data © <a href='https://www.openstreetmap.org/copyright' target='blank'>OpenStreetMap contributors</a></p><p>Thunderforest is a project by Gravitystorm Limited.</p>",
          loadOnly: false,
          display: false,
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
          name: 'osm_1',
          title: 'Standard OpenStreetMap',
          description: "<p>© <a href='https://www.openstreetmap.org/copyright' target='blank'>OpenStreetMap contributors</a></p>",
          loadOnly: false,
          display: true,
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
