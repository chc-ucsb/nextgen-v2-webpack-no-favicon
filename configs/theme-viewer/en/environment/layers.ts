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
          title: 'River Flow Estimates',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/GeoSUR_River_Watch_Sites/MapServer/WMSServer?',
          },
          infoFormat: 'application/geojson',
          loadOnly: false,
          display: false,
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
            title: 'River Flow Estimates',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '3',
          title: 'Coral Reefs',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/Amenazas_Arrecifes_Coral/MapServer/WMSServer?',
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
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td><img src="https://www.geosur.info/ogcservices/services/GeoSUR/Amenazas_Arrecifes_Coral/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=3"/></td><td>Arrecifes de Coral</td></tr>' +
              '</table>',
            title: 'Coral Reefs',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0,1,2',
          title: 'Environment',
          description: '',
          source: {
            arcgis: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/Ambiente/MapServer/WMSServer',
            xyz: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/Ambiente/MapServer/tile/{z}/{y}/{x}',
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/Ambiente/MapServer/WMSServer?',
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
              '<tr><td><img style="opacity:0.7" src="https://geosur.info/ogcservices/services/GeoSUR/Ambiente/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=2"/> Áreas protegidas</td></tr>' +
              '<tr><td>Ecoregiones</td></tr>' +
              '<tr><td><img style="opacity:0.7" src="https://geosur.info/ogcservices/services/GeoSUR/Ambiente/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1"/></td></tr>' +
              '<tr><td>Ecosistemas</td></tr>' +
              '<tr><td><img style="opacity:0.7" src="https://geosur.info/ogcservices/services/GeoSUR/Ambiente/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'Andean Ecosystems',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0',
          title: 'Andean Ecosystems',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/Mapa_Ecosistemas_Andino/MapServer/WMSServer?',
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
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td>Ecosistemas_Andino</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/Mapa_Ecosistemas_Andino/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'Andean Ecosystems',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0',
          title: 'Central America Ecosystems',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/Mapa_Ecosistemas_Centro_America/MapServer/WMSServer?',
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
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td>NS_WB_Ecosystem_Crosswalk</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/Mapa_Ecosistemas_Centro_America/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'Central America Ecosystems',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0',
          title: 'Rarerity Species',
          description: '',
          source: {
            arcgis: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/GeoSUR_Andes_Amazon_Rareza_Especies/MapServer/WMSServer',
            xyz: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/GeoSUR_Andes_Amazon_Rareza_Especies/MapServer/tile/{z}/{y}/{x}',
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/GeoSUR_Andes_Amazon_Rareza_Especies/MapServer/WMSServer?',
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
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td>AndesAmaz_Rareza_terrestre</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Andes_Amazon_Rareza_Especies/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'Rarerity Species',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0',
          title: 'Mangroves',
          description: '',
          source: {
            arcgis: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/GeoSUR_Manglares/MapServer/WMSServer',
            xyz: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/GeoSUR_Manglares/MapServer/tile/{z}/{y}/{x}',
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/GeoSUR_Manglares/MapServer/WMSServer?',
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
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td>Mangroves</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Manglares/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'Mangroves',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0',
          title: 'Gran Chaco Deforestation',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/Deforestacion/MapServer/WMSServer?',
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
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/Deforestacion/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td><td>Deforestacion_hasta_Noviembre2014</td></tr>' +
              '</table>',
            title: 'Gran Chaco Deforestation',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0',
          title: 'Terra-i Vegetation Change',
          description: '',
          source: {
            arcgis: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/GeoSUR_Terrai_Vegetation_Change/MapServer/WMSServer',
            xyz: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/GeoSUR_Terrai_Vegetation_Change/MapServer/tile/{z}/{y}/{x}',
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/GeoSUR_Terrai_Vegetation_Change/MapServer/WMSServer?',
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
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td>2004/01/01 - 2015/04/07</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Terrai_Vegetation_Change/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'Terra-i Vegetation Change',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0',
          title: 'Woody Biomass',
          description: '',
          source: {
            arcgis: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/Woody_Biomass/MapServer/WMSServer',
            xyz: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/Woody_Biomass/MapServer/tile/{z}/{y}/{x}',
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/Woody_Biomass/MapServer/WMSServer?',
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
          legend: {
            style: '',
            customHtml:
              '<table>' +
              '<tr><td>whrc_biomass_SA_WebMercator</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/Woody_Biomass/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'Woody Biomass',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0',
          title: 'Land Use/Cover',
          description: '',
          source: {
            arcgis: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/Global_Cover_2009/MapServer/WMSServer',
            xyz: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/Global_Cover_2009/MapServer/tile/{z}/{y}/{x}',
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/Global_Cover_2009/MapServer/WMSServer?',
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
            customImageURL:
              'https://geosur.info/ogcservices/services/GeoSUR/Global_Cover_2009/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0',
            title: 'Land Use/Cover',
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
