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
          name: '0,1,2',
          title: 'IDEAL',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/GeoSUR_Infraestructura_Projectos_IDEAL/MapServer/WMSServer?',
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
            Nombre_de_: {
              displayName: 'Proyecto',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Pais: {
              displayName: 'País',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Cliente: {
              displayName: 'Cliente',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Sector: {
              displayName: 'Sector',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Subsector: {
              displayName: 'Subsector',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Comentario: {
              displayName: 'Comentario',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Otros_proy: {
              displayName: 'Otros Proyectos',
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
              '<tr><td>Proyectos Puntuales</td></tr><tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Infraestructura_Projectos_IDEAL/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=2"/></td></tr>' +
              '<tr><td>Proyectos Lineales</td></tr><tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Infraestructura_Projectos_IDEAL/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1"/></td></tr>' +
              '<tr><td>Poligonos_IDEAL</td></tr><tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Infraestructura_Projectos_IDEAL/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'IDEAL',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '25,26',
          title: 'IIRSA',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/Infraestructura/MapServer/WMSServer?',
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
            PROYECTO: {
              displayName: 'Proyecto',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            CODIGO: {
              displayName: 'Código',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            OBJETIVO: {
              displayName: 'Objetivo',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            RESPONSAB: {
              displayName: 'Responsable',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            Pais: {
              displayName: 'País',
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
              '<tr><td>Proyectos puntuales</td></tr><tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/Infraestructura/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=26"/></td></tr>' +
              '<tr><td>Proyectos lineales</td></tr><tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/Infraestructura/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=25"/></td></tr>' +
              '</table>',
            title: 'IIRSA',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36',
          title: 'Mapa de Expansión Urbana',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?',
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
              '<p>Buenos Aires</p>' +
              '<table>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=36"/></td><td>BA_1809</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=35"/></td><td>BA_1836</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=34"/></td><td>BA_1867</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=33"/></td><td>BA_1887</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=32"/></td><td>BA_1918</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=31"/></td><td>BA_1943</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=30"/></td><td>BA_1964</td></tr>' +
              '</table>' +
              '<p>Ciudad de Guatemala</p>' +
              '<table>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=28"/></td><td>CG_1800</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=27"/></td><td>CG_1850</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=26"/></td><td>CG_1900</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=25"/></td><td>CG_1936</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=24"/></td><td>CG_1950</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=23"/></td><td>CG_1976</td></tr>' +
              '</table>' +
              '<p>Ciudad de Mexico</p>' +
              '<table>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=21"/></td><td>CM_1807</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=20"/></td><td>CM_1830</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=19"/></td><td>CM_1861</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=18"/></td><td>CM_1910</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=17"/></td><td>CM_1929</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=16"/></td><td>CM_1950</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=15"/></td><td>CM_1970</td></tr>' +
              '</table>' +
              '<p>Santiago</p>' +
              '<table>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer="/></td><td>S_1800</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer="/></td><td>S_1850</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer="/></td><td>S_1875</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer="/></td><td>S_1900</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer="/></td><td>S_1930</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer="/></td><td>S_1950</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer="/></td><td>S_1970</td></tr>' +
              '</table>' +
              '<p>Sao Paulo</p>' +
              '<table>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=5"/></td><td>SP_1881</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=4"/></td><td>SP_1905</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=3"/></td><td>SP_1929</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=2"/></td><td>SP_1949</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Expansion_Urbana/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=2"/></td><td>SP_1974</td></tr>' +
              '</table>',
            title: 'Mapa de Expansión Urbana',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0,1,2',
          title: 'Límites administrativos',
          description: '',
          source: {
            arcgis: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/Limites_administrativos/MapServer/WMSServer',
            xyz: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/Limites_administrativos/MapServer/tile/{z}/{y}/{x}',
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/Limites_administrativos/MapServer/WMSServer?',
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
              '<tr><td>Limites_Nacionales</td></tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/Limites_administrativos/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=2"/></td></tr>' +
              '<tr><td>Limites_Departamentales</td></tr><tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/Limites_administrativos/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1"/></td></tr>' +
              '<tr><td>Limites_Municipales</td></tr><tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/Limites_administrativos/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '</table>',
            title: 'Límites administrativos',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
          title: 'Mapa de Suramérica 1:1MM',
          description: '',
          source: {
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?',
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
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=15"/></td><td>Aeropuertos</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=14"/></td><td>Lugares_poblados</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=13"/></td><td>Zonas_urbanizadas</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=11"/></td><td>Zonas_Urbanas</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=9"/></td><td>Areas_administrativas</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=8"/></td><td>Linea_de_costa</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=7"/></td><td>Limites_administrativos</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=5"/></td><td>Rios</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=4"/></td><td>Cuerpos_de_agua</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=2"/></td><td>Ferrocarril</td></tr>' +
              '<tr><td><img src="https://geosur.info/ogcservices/services/GeoSUR/GeoSUR_Mapa_Global_de_las_Americas/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1"/></td><td>Carreteras</td></tr>' +
              '</table>',
            title: 'Mapa de Suramérica 1:1MM',
          },
        },

        {
          type: 'layer',
          id: '',
          name: '0,1',
          title: 'Radiación Nocturna 2010 (NOAA)',
          description: '',
          source: {
            arcgis: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/NOAA_Nighttime_Lights_2010/MapServer/WMSServer',
            xyz: 'https://www.geosur.info/ogcservices/rest/services/GeoSUR/NOAA_Nighttime_Lights_2010/MapServer/tile/{z}/{y}/{x}',
            wms: 'https://www.geosur.info/ogcservices/services/GeoSUR/NOAA_Nighttime_Lights_2010/MapServer/WMSServer?',
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
              '<tr><td>F182010.v4c_web.avg_vis</td></tr><tr><td><img style="opacity:0.7" src="https://geosur.info/ogcservices/services/GeoSUR/NOAA_Nighttime_Lights_2010/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"/></td></tr>' +
              '<tr><td>F182010.v4c_web.stable_lights</td></tr><tr><td><img style="opacity:0.7" src="https://geosur.info/ogcservices/services/GeoSUR/NOAA_Nighttime_Lights_2010/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1"/></td></tr>' +
              '</table>',
            title: 'Radiación Nocturna 2010 (NOAA)',
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
