/*******************************************************************************
 * @license
 * Copyright (c) 2014 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 * 
 * Contributors: IBM Corporation - initial API and implementation
 ******************************************************************************/
/*eslint-env browser, amd*/
define(['i18n!cfui/nls/messages', 'orion/selection', 'orion/widgets/input/ComboTextInput', 'orion/webui/Wizard', 'orion/webui/littlelib'], 
		function(messages, mSelection, ComboTextInput, mWizard, lib){
	
	/**
	 * A core page builder. The page gathers the minimum necessary
	 * deployment parameters, i.e. target, application name & host.
	 *
	 */
	function CorePageBuilder(options){
		options = options || {};
		this._init(options);
	}
	
	CorePageBuilder.constructor = CorePageBuilder;
	CorePageBuilder.prototype = {
			
		_init : function(options){
			
			this._clouds = options.Clouds || [];
			this._defaultTarget = options.DefaultTarget;
			this._manifestApplication = options.ManifestApplication;
			this._serviceRegistry = options.serviceRegistry;
			this._cfService = options.CFService;
			
			this._showMessage = options.showMessage;
			this._hideMessage = options.hideMessage;
			this._handleError = options.handleError;
			this._postError = options.postError;		
			
			/* application list */
			this._appsList = [];
			this._appsDeferred;
			
			/* route list */
			this._routesList = [];
			this._routesDeferred;
		},
		
		_setSelection : function(){
			var self = this;
			
			if(!self._spacesDropdown.value){
				self._selection.setSelections();
				return;
			}
			
			var orgTargets = self._targets[self._orgsDropdown.value];
			if(!orgTargets){
				self._selection.setSelections();
				return;
			}
			
			for(var i=0; i<orgTargets.length; i++){
				if(orgTargets[i].Space == self._spacesDropdown.value){
					self._selection.setSelections(orgTargets[i]);
					self._defaultTarget.OrgId = null;
					self._defaultTarget.OrgName = orgTargets[i].Org;
					self._defaultTarget.SpaceId = null;
					self._defaultTarget.SpaceName = orgTargets[i].Space;
					return;
				}
			}
		},
		
		_loadTargets : function(target){
			var self = this;
			
			self._showMessage(messages["loadingDeploymentSettings..."]);
			self._cfService.getOrgs(target).then(function(orgs){
				
				lib.empty(self._orgsDropdown);
				orgs.Orgs.forEach(function(org){
					
					var option = document.createElement("option"); //$NON-NLS-0$
					option.appendChild(document.createTextNode(org.Name));
					option.org = org;
					
					if (self._defaultTarget && (self._defaultTarget.OrgId === org.Guid
							|| self._defaultTarget.OrgName === org.Name)){
						option.selected = "selected"; //$NON-NLS-0$
						self._defaultTarget.OrgName = org.Name;
					}
					
					self._orgsDropdown.appendChild(option);
					self._targets[org.Name] = [];
					
					if (org.Spaces){
						org.Spaces.forEach(function(space){
							var newTarget = {};
							newTarget.Url = target.Url;
							if (target.ManageUrl)
								newTarget.ManageUrl = target.ManageUrl;
							
							newTarget.Org = org.Name;
							newTarget.Space = space.Name;
							newTarget.SpaceId = space.Guid;
							self._targets[org.Name].push(newTarget);
						});
					}
				});
				
				self._loadSpaces(self._orgsDropdown.value);
				self._hideMessage();
				
			}, function(error){
				self._handleError(error, target, function(){ self._loadTargets(target); });
			});
		},
		
		_loadSpaces : function(org){
			var self = this;
			
			var targetsToDisplay = self._targets[org];
			lib.empty(self._spacesDropdown);
			
			targetsToDisplay.forEach(function(target){
				var option = document.createElement("option"); //$NON-NLS-0$
				option.appendChild(document.createTextNode(target.Space));
				option.target = target;
				
				if (self._defaultTarget && (self._defaultTarget.SpaceId === target.SpaceId
						|| self._defaultTarget.SpaceName === target.Space)){
					option.selected = "selected"; //$NON-NLS-0$
					self._defaultTarget.SpaceName = target.Space;
				}
				
				self._spacesDropdown.appendChild(option);
			});
			
			self._setSelection();
			self._selection.getSelection(function(selection){
				self._loadApplications(selection);
				self._loadHosts(selection);
			});
		},
		
		_loadApplications : function(target){
			var self = this;
			
			self._appsDeferred = self._cfService.getApps(target);
			self._appsDeferred.then(function(apps){
				self._appsList = [];
				if(apps.Apps){
					apps.Apps.forEach(function(app){
						self._appsList.push(app.Name);
					});
				}
			});
		},
		
		_loadHosts : function(target){
			var self = this;
			
			self._routesDeferred = self._cfService.getRoutes(target);
			self._routesDeferred.then(function(routes){
				if(routes.Routes){
					self._routesList = [];
					routes.Routes.forEach(function(route){
						self._routesList.push(route.Host);
					});
				}
			});							
		},
		
		getSelection : function(){
			return this._selection;
		},
			
		build : function(){
			
			var self = this;
			return new mWizard.WizardPage({
				
		    	template: "<table class=\"formTable\">"+ //$NON-NLS-0$
			    	"<tr>"+ //$NON-NLS-0$
						"<td id=\"cloudsLabel\" class=\"label\"></td>"+ //$NON-NLS-0$
						"<td id=\"clouds\" class=\"selectCell\"></td>"+ //$NON-NLS-0$
					"</tr>"+ //$NON-NLS-0$
					"<tr>"+ //$NON-NLS-0$
						"<td id=\"orgsLabel\" class=\"label\"></td>"+ //$NON-NLS-0$
						"<td id=\"orgs\" class=\"selectCell\"></td>"+ //$NON-NLS-0$
					"</tr>"+ //$NON-NLS-0$
					"<tr>"+ //$NON-NLS-0$
						"<td id=\"spacesLabel\" class=\"label\"></td>"+ //$NON-NLS-0$
						"<td id=\"spaces\" class=\"selectCell\"></td>"+ //$NON-NLS-0$
					"</tr>"+ //$NON-NLS-0$
					"<tr class=\"rowSeparator\"></tr>" + //$NON-NLS-0$
					"<tr>"+ //$NON-NLS-0$
						"<td id=\"nameLabel\" class=\"label\"></td>"+ //$NON-NLS-0$
						"<td id=\"name\" class=\"selectCell\"></td>"+ //$NON-NLS-0$
					"</tr>"+ //$NON-NLS-0$
					"<tr>"+ //$NON-NLS-0$
						"<td id=\"hostLabel\" class=\"label\"></td>"+ //$NON-NLS-0$
						"<td id=\"host\" class=\"selectCell\"></td>"+ //$NON-NLS-0$
					"</tr>"+ //$NON-NLS-0$
				"</table>", //$NON-NLS-0$
				
				render: function(){
					this.wizard.validate();
					self._targets = {};
					
					/* render the clouds field */
					if (self._clouds.length > 1){
						document.getElementById("cloudsLabel").appendChild(document.createTextNode(messages["target*:"])); //$NON-NLS-0$
						self._cloudsDropdown = document.createElement("select"); //$NON-NLS-0$
						
						self._clouds.forEach(function(cloud){
							var option = document.createElement("option"); //$NON-NLS-0$
							option.appendChild(document.createTextNode(cloud.Name || cloud.Url));
							option.cloud = cloud;
							
							if (self._defaultTarget && self._defaultTarget.Url === cloud.Url)
								option.selected = "selected"; //$NON-NLS-0$
							
							self._cloudsDropdown.appendChild(option);
						});
						
						self._cloudsDropdown.onchange = function(event){
							lib.empty(self._orgsDropdown);
							lib.empty(self._spacesDropdown);
							self._setSelection();
							
							var selectedCloud = self._clouds[event.target.selectedIndex];
							self._loadTargets(selectedCloud);
						};
						
						document.getElementById("clouds").appendChild(self._cloudsDropdown); //$NON-NLS-0$
						
					} else {
						document.getElementById("cloudsLabel").appendChild(document.createTextNode(messages["target:"])); //$NON-NLS-0$
						document.getElementById("clouds").appendChild(document.createTextNode(self._clouds[0].Name || self._clouds[0].Url)); //$NON-NLS-0$
					}
	
					/* render the organizations field */
					document.getElementById("orgsLabel").appendChild(document.createTextNode(messages["organization*:"])); //$NON-NLS-0$
					self._orgsDropdown = document.createElement("select"); //$NON-NLS-0$
					self._orgsDropdown.onchange = function(event){
						var selectedOrg = event.target.value;
						self._loadSpaces(selectedOrg);
					};
					
					document.getElementById("orgs").appendChild(self._orgsDropdown); //$NON-NLS-0$
					
					/* render the spaces field */
					self._selection = new mSelection.Selection(self._serviceRegistry, "orion.Spaces.selection"); //$NON-NLS-0$
					self._selection.addEventListener("selectionChanged", function(){this.validate();}.bind(this.wizard)); //$NON-NLS-0$
					
					document.getElementById("spacesLabel").appendChild(document.createTextNode(messages["space*:"])); //$NON-NLS-0$
					self._spacesDropdown = document.createElement("select"); //$NON-NLS-0$
					self._spacesDropdown.onchange = function(event){
						self._setSelection();
						self._selection.getSelection(function(selection){
							self._loadApplications(selection);
							self._loadHosts(selection);
						});
					};
					
					document.getElementById("spaces").appendChild(self._spacesDropdown); //$NON-NLS-0$
					
					/* render the application name field */
					document.getElementById("nameLabel").appendChild(document.createTextNode(messages["applicationName*:"])); //$NON-NLS-0$
					self._appsDropdown = new ComboTextInput({
						id: "applicationNameTextInput", //$NON-NLS-0$
						parentNode: document.getElementById("name"), //$NON-NLS-0$
						insertBeforeNode: this._replaceWrapper,
						hasButton: false,
						hasInputCompletion: true,
						serviceRegistry: this._serviceRegistry,
						onRecentEntryDelete: null,
						defaultRecentEntryProposalProvider: function(onItem){
							self._appsDeferred.then(function(){
								
								var ret = [];
								self._appsList.forEach(function(app){
									if(!app) return;
									ret.push({
										type: "proposal", //$NON-NLS-0$
										label: app,
										value: app
									});
								});
								
								onItem(ret);									
							});
						}
					});
					
					self._appsInput = self._appsDropdown.getTextInputNode();						
					self._appsInput.onkeyup = function(){this.validate();}.bind(this.wizard);
					self._appsInput.addEventListener("focus",function(){this.validate();}.bind(this.wizard)); //$NON-NLS-0$
					
					if(self._manifestApplication.name)
						self._appsInput.value = self._manifestApplication.name;
					
					/* render the application host field */
					document.getElementById("hostLabel").appendChild(document.createTextNode(messages["host:"])); //$NON-NLS-0$
					self._hostDropdown = new ComboTextInput({
						id: "applicationRouteTextInput", //$NON-NLS-0$
						parentNode: document.getElementById("host"), //$NON-NLS-0$
						insertBeforeNode: this._replaceWrapper,
						hasButton: false,
						hasInputCompletion: true,
						serviceRegistry: this._serviceRegistry,
						onRecentEntryDelete: null,
						defaultRecentEntryProposalProvider: function(onItem){
							self._routesDeferred.then(function(){
								
								var ret = [];
								self._routesList.forEach(function(route){
									if(!route) return;
									ret.push({
										type: "proposal", //$NON-NLS-0$
										label: route,
										value: route
									});
								});
								
								onItem(ret);
							});
						}
					});
					
					self._hostInput = self._hostDropdown.getTextInputNode();
					self._hostInput.value = self._manifestApplication.host || self._manifestApplication.name || "";
					
					var selectedCloud = self._clouds[self._clouds.length > 1 ? self._cloudsDropdown.selectedIndex : 0];
					self._loadTargets(selectedCloud);
			    },
			    
			    validate: function(setValid) {
					
			    	if(!self._selection){
						setValid(false);
						return;
					}
					
					if(!self._appsInput.value){
						setValid(false);
						return;
					}
					
					self._selection.getSelection(function(selection) {
						if(selection === null || selection.length === 0){
							setValid(false);
							return;
						}
						
						if(self._appsInput.value){ setValid(true); }
						else { setValid(false); }
					});
				},
				
				getResults: function(){
					var res = {};
					if(self._appsInput && self._appsInput.value){
						res.name = self._appsInput.value;
					}
					
					if(self._hostInput && self._hostInput.value){
						res.host = self._hostInput.value;
					}
					
					return res;
				}
			});
		}
	};
	
	return {
		CorePageBuilder : CorePageBuilder
	};
});