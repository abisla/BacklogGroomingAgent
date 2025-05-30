"use client";

import React, { useState, useEffect } from 'react';
import { Upload, Brain, Target, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Zap, Filter, Search, Download, Slack, ExternalLink, Eye, X, Sparkles, Info, ArrowRight } from 'lucide-react';

interface FileInfo {
  name: string;
  type: string;
  size: number;
}

interface TeamCapacity {
  velocity: number;
  capacity: number;
  sprints: number;
}

interface ProcessedItem {
  id: string;
  title: string;
  type: 'User Story' | 'Bug' | 'Feature' | 'Spike';
  epic: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  effort: number;
  roi: number;
  risk: 'High' | 'Medium' | 'Low';
  flags: string[];
  acceptance: string[];
  dependencies: string[];
  aiGenerated: boolean;
}

interface OriginalTicket {
  title: string;
  description: string;
  status: string;
  reporter: string;
}

const StrategicBacklogAI = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [processingStage, setProcessingStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [teamCapacity, setTeamCapacity] = useState<TeamCapacity>({ velocity: 45, capacity: 8, sprints: 12 });
  const [sprintGoals, setSprintGoals] = useState('Improve user onboarding flow and reduce checkout abandonment');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProcessedItem | null>(null);

  // Mock original tickets (what was uploaded)
  const originalTickets: Record<string, OriginalTicket> = {
    'US-001': {
      title: 'onboarding thing',
      description: 'users confused about app, need help',
      status: 'backlog',
      reporter: 'sarah@company.com'
    },
    'BUG-002': {
      title: 'button broken mobile',
      description: 'checkout not working on iphone',
      status: 'open',
      reporter: 'mike@company.com'
    },
    'FEAT-003': {
      title: 'recommendations',
      description: 'show products users might like',
      status: 'idea',
      reporter: 'product@company.com'
    },
    'SPIKE-004': {
      title: 'payment research',
      description: 'look into stripe alternatives',
      status: 'backlog',
      reporter: 'tech-lead@company.com'
    }
  };

  // Mock processed data
  const [processedItems, setProcessedItems] = useState<ProcessedItem[]>([
    {
      id: 'US-001',
      title: 'As a new user, I want a guided onboarding tour so I can understand key features quickly',
      type: 'User Story',
      epic: 'User Onboarding',
      priority: 'High',
      effort: 8,
      roi: 85,
      risk: 'Low',
      flags: [],
      acceptance: ['Tour highlights 5 core features', 'Skippable at any point', 'Analytics tracking implemented'],
      dependencies: ['Analytics service', 'Feature flag system'],
      aiGenerated: true
    },
    {
      id: 'BUG-002',
      title: 'Fix checkout button disabled state on mobile Safari',
      type: 'Bug',
      epic: 'Checkout Flow',
      priority: 'Critical',
      effort: 3,
      roi: 95,
      risk: 'Medium',
      flags: ['Revenue Impact', 'Browser Specific'],
      acceptance: ['Button clickable on all iOS versions', 'Cross-browser testing complete'],
      dependencies: ['Mobile testing framework'],
      aiGenerated: true
    },
    {
      id: 'FEAT-003',
      title: 'Implement smart product recommendations engine',
      type: 'Feature',
      epic: 'Personalization',
      priority: 'Medium',
      effort: 21,
      roi: 70,
      risk: 'High',
      flags: ['ML Integration', 'Data Privacy'],
      acceptance: ['ML model deployed', 'A/B testing framework ready', 'GDPR compliance verified'],
      dependencies: ['ML infrastructure', 'User consent system', 'Analytics pipeline'],
      aiGenerated: true
    },
    {
      id: 'SPIKE-004',
      title: 'Research payment gateway alternatives for international expansion',
      type: 'Spike',
      epic: 'Global Expansion',
      priority: 'Low',
      effort: 5,
      roi: 60,
      risk: 'Low',
      flags: ['Research Only'],
      acceptance: ['3 providers evaluated', 'Cost analysis complete', 'Integration complexity assessed'],
      dependencies: [],
      aiGenerated: true
    }
  ]);

  const processingStages = [
    'Clustering & Categorization',
    'Refinement & Decomposition',
    'Prioritization Engine',
    'Cross-Check & Impact Analysis',
    'Export Preparation'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, type: f.type, size: f.size }))]);
  };

  const startProcessing = async () => {
    setIsProcessing(true);
    setProcessingStage(0);
    setActiveTab('processing');
    
    try {
      // Convert original tickets to array format
      const items = Object.entries(originalTickets).map(([id, ticket]) => ({
        id,
        ...ticket
      }));

      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to process items');
      }

      const { processedItems } = await response.json();
      setProcessedItems(processedItems);
      
      // Simulate processing stages
      const interval = setInterval(() => {
        setProcessingStage(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            setIsProcessing(false);
            setActiveTab('results');
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setIsProcessing(false);
      alert('Failed to process items. Please try again.');
    }
  };

  const showSourceModal = (item: ProcessedItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const getPriorityColor = (priority: ProcessedItem['priority']) => {
    switch(priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: ProcessedItem['type']) => {
    switch(type) {
      case 'User Story': return <Users className="w-4 h-4" />;
      case 'Bug': return <AlertTriangle className="w-4 h-4" />;
      case 'Feature': return <Zap className="w-4 h-4" />;
      case 'Spike': return <Brain className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const exportToSlack = () => {
    const topItems = processedItems.slice(0, 5);
    const slackMessage = `🚀 **Daily Grooming Digest**

📊 **Backlog Health**: ${processedItems.length} items processed
🎯 **Sprint-Ready**: ${processedItems.filter(i => i.effort <= 8).length} items
⚠️ **High Priority**: ${processedItems.filter(i => i.priority === 'High' || i.priority === 'Critical').length} items

**🔥 Top 5 Items for Grooming Discussion:**

${topItems.map((item, index) => 
`${index + 1}. **${item.title.substring(0, 60)}...**
   • Type: ${item.type} | Priority: ${item.priority}
   • Effort: ${item.effort} pts | ROI: ${item.roi}%
   • Epic: ${item.epic}`).join('\n\n')}

💡 **Recommendation**: Focus on items US-001 and BUG-002 for immediate sprint inclusion.`;
    
    navigator.clipboard.writeText(slackMessage);
    alert('Slack digest copied to clipboard!');
  };

  const exportToCsv = () => {
    const csvContent = [
      ['ID', 'Title', 'Type', 'Epic', 'Priority', 'Effort', 'ROI', 'Risk', 'Dependencies'].join(','),
      ...processedItems.map(item => [
        item.id,
        `"${item.title}"`,
        item.type,
        item.epic,
        item.priority,
        item.effort,
        item.roi,
        item.risk,
        `"${item.dependencies?.join('; ')}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strategic-backlog-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Strategic Backlog AI</h1>
                <p className="text-sm text-purple-200 italic">From chaos to clarity in 90 seconds—AI backlog grooming for elite product teams</p>
                <p className="text-xs text-purple-300 mt-1">Designed by Amar Bisla</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm text-purple-200">
                <div>Team Velocity: {teamCapacity.velocity} pts/sprint</div>
                <div>Capacity: {teamCapacity.capacity} developers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-1 bg-black/20 backdrop-blur-sm rounded-xl p-1">
          {[
            { id: 'input', label: 'Data Input', icon: Upload },
            { id: 'processing', label: 'AI Processing', icon: Brain },
            { id: 'results', label: 'Strategic Output', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {activeTab === 'input' && (
          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Upload className="w-6 h-6 mr-3 text-purple-400" />
                Upload Raw Backlog Data
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-purple-400/50 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".csv,.json,.xlsx,.txt"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">JIRA Export / CSV Files</h3>
                    <p className="text-purple-200 text-sm">Upload backlog items, user stories, bugs</p>
                  </label>
                </div>

                <div className="border-2 border-dashed border-blue-400/50 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Meeting Notes</h3>
                  <p className="text-blue-200 text-sm">Stakeholder transcripts, requirements</p>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="text-purple-200 font-medium">Uploaded Files:</h4>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                      <span className="text-white text-sm">{file.name}</span>
                      <span className="text-purple-200 text-xs">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Sprint Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-purple-200 text-sm mb-2">Sprint Goals</label>
                    <textarea
                      value={sprintGoals}
                      onChange={(e) => setSprintGoals(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                      rows={3}
                      placeholder="Define your sprint objectives..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Team Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Average Velocity</span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={teamCapacity.velocity}
                        onChange={(e) => setTeamCapacity({...teamCapacity, velocity: parseInt(e.target.value)})}
                        className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-center"
                      />
                      <span className="text-purple-200 ml-2">pts/sprint</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Team Size</span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={teamCapacity.capacity}
                        onChange={(e) => setTeamCapacity({...teamCapacity, capacity: parseInt(e.target.value)})}
                        className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-center"
                      />
                      <span className="text-purple-200 ml-2">developers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={startProcessing}
                disabled={uploadedFiles.length === 0}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
              >
                <Brain className="w-6 h-6" />
                <span>Start AI Analysis</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'processing' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">AI Processing Pipeline</h2>
                <p className="text-purple-200">Analyzing your backlog with advanced algorithms</p>
              </div>

              <div className="space-y-6">
                {processingStages.map((stage, idx) => (
                  <div key={idx} className={`flex items-center space-x-4 p-4 rounded-lg ${
                    idx < processingStage ? 'bg-green-500/20 border border-green-400/30' :
                    idx === processingStage ? 'bg-purple-500/20 border border-purple-400/30 animate-pulse' :
                    'bg-gray-500/10 border border-gray-400/20'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      idx < processingStage ? 'bg-green-500' :
                      idx === processingStage ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}>
                      {idx < processingStage ? <CheckCircle className="w-6 h-6 text-white" /> :
                       idx === processingStage ? <Clock className="w-6 h-6 text-white animate-spin" /> :
                       <div className="w-6 h-6 bg-white/30 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{stage}</h3>
                      <p className="text-sm text-purple-200">
                        {idx === 0 && "Grouping similar items using LLM embeddings"}
                        {idx === 1 && "Converting to proper user stories with acceptance criteria"}
                        {idx === 2 && "Calculating ROI, risk, and effort scores"}
                        {idx === 3 && "Identifying dependencies and potential blockers"}
                        {idx === 4 && "Preparing export formats and recommendations"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-8">
            {/* Impact Banner */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">🎯 Processing Complete - Ready for Sprint Planning</h3>
                  <p className="text-green-200">
                    <strong>Time Saved:</strong> ~12 hours of backlog grooming • <strong>Stories Enhanced:</strong> 4/4 with AI-generated acceptance criteria • <strong>Dependencies Identified:</strong> 6 critical blockers found
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">12hrs</div>
                  <div className="text-sm text-green-200">Time Saved</div>
                </div>
              </div>
            </div>

            {/* Summary Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Total Items</p>
                    <p className="text-3xl font-bold text-white">{processedItems.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">High Priority</p>
                    <p className="text-3xl font-bold text-white">{processedItems.filter(i => i.priority === 'High' || i.priority === 'Critical').length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Total Effort</p>
                    <p className="text-3xl font-bold text-white">{processedItems.reduce((sum, item) => sum + item.effort, 0)}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Avg ROI</p>
                    <p className="text-3xl font-bold text-white">{Math.round(processedItems.reduce((sum, item) => sum + item.roi, 0) / processedItems.length)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>

            {/* Prioritized Backlog */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Prioritized Backlog</h2>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                      <Slack className="w-4 h-4" />
                      <span>Export to Slack</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export CSV (JIRA Import Ready)</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>Push to JIRA</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {processedItems.map((item, idx) => (
                  <div key={item.id} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(item.priority)}`}></div>
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-purple-300 font-mono text-sm">{item.id}</span>
                            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">{item.epic}</span>
                            {item.flags?.map(flag => (
                              <span key={flag} className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">{flag}</span>
                            ))}
                            <button 
                              onClick={() => showSourceModal(item)}
                              className="flex items-center space-x-1 text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Source</span>
                            </button>
                          </div>
                          <h3 className="text-white font-medium mb-2">{item.title}</h3>
                          <div className="text-sm text-purple-200 space-y-1">
                            <div className="flex items-center space-x-2">
                              <p><strong>Acceptance Criteria:</strong></p>
                              {item.aiGenerated && (
                                <div className="flex items-center space-x-1 text-xs text-green-300">
                                  <Sparkles className="w-3 h-3" />
                                  <span>AI-generated based on feature context</span>
                                </div>
                              )}
                            </div>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              {item.acceptance?.map((criteria, idx) => (
                                <li key={idx}>{criteria}</li>
                              ))}
                            </ul>
                            {item.dependencies?.length > 0 && (
                              <p className="mt-2"><strong>Dependencies:</strong> {item.dependencies.join(', ')}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="text-purple-200">Effort</div>
                          <div className="text-white font-semibold">{item.effort}pts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-200">ROI</div>
                          <div className="text-white font-semibold">{item.roi}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-200">Risk</div>
                          <div className={`font-semibold ${
                            item.risk === 'High' ? 'text-red-400' :
                            item.risk === 'Medium' ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>{item.risk}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sprint Recommendation */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Sprint Recommendation
              </h3>
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-400/20">
                <p className="text-white mb-2">
                  <strong>Recommended for Next Sprint:</strong> Items US-001, BUG-002 (Total: 11 points)
                </p>
                <p className="text-green-200 text-sm mb-3">
                  This combination aligns with your sprint goals, fits team capacity ({teamCapacity.velocity} pts), and addresses critical revenue-impacting issues first.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2 text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    <span>Used in real sprint planning with 8-person team</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-300">
                    <Clock className="w-4 h-4" />
                    <span>Saved 12 hours of manual grooming</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-8 border border-purple-400/30 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Product Management?</h3>
              <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
                This demo showcases real AI-powered backlog grooming that saves hours of manual work and improves sprint planning accuracy. 
                Hiring managers—let me walk you through how this scales to enterprise-level product teams.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                  Schedule Demo
                </button>
                <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                  View GitHub
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Source Comparison Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Eye className="w-6 h-6 mr-3 text-blue-400" />
                  Source Ticket → AI Transformation
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original Ticket */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Original Ticket</h4>
                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">Raw Input</span>
                  </div>
                  <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-red-200 text-sm font-medium">Title:</span>
                      <p className="text-white">{originalTickets[selectedItem.id]?.title}</p>
                    </div>
                    <div>
                      <span className="text-red-200 text-sm font-medium">Description:</span>
                      <p className="text-white">{originalTickets[selectedItem.id]?.description}</p>
                    </div>
                    <div>
                      <span className="text-red-200 text-sm font-medium">Status:</span>
                      <p className="text-white">{originalTickets[selectedItem.id]?.status}</p>
                    </div>
                    <div>
                      <span className="text-red-200 text-sm font-medium">Reporter:</span>
                      <p className="text-white">{originalTickets[selectedItem.id]?.reporter}</p>
                    </div>
                    <div className="mt-4 p-3 bg-red-600/20 rounded border border-red-400/20">
                      <p className="text-red-200 text-sm"><strong>Issues:</strong></p>
                      <ul className="text-xs text-red-300 mt-1 space-y-1">
                        <li>• Vague requirements</li>
                        <li>• No acceptance criteria</li>
                        <li>• Missing effort estimation</li>
                        <li>• No priority assessment</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI Transformed */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">AI-Transformed Story</h4>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">Enhanced</span>
                    <Sparkles className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-green-200 text-sm font-medium">Enhanced Title:</span>
                      <p className="text-white">{selectedItem.title}</p>
                    </div>
                    <div>
                      <span className="text-green-200 text-sm font-medium">Type & Epic:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">{selectedItem.type}</span>
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">{selectedItem.epic}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-green-200 text-sm font-medium">AI-Generated Acceptance Criteria:</span>
                      <ul className="list-disc list-inside space-y-1 mt-2 text-white text-sm">
                        {selectedItem.acceptance?.map((criteria, idx) => (
                          <li key={idx}>{criteria}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-green-200 text-xs">Priority</div>
                        <div className={`text-sm font-semibold px-2 py-1 rounded ${
                          selectedItem.priority === 'Critical' ? 'bg-red-500/20 text-red-300' :
                          selectedItem.priority === 'High' ? 'bg-orange-500/20 text-orange-300' :
                          selectedItem.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {selectedItem.priority}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-200 text-xs">Effort</div>
                        <div className="text-white font-semibold">{selectedItem.effort} pts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-200 text-xs">ROI</div>
                        <div className="text-white font-semibold">{selectedItem.roi}%</div>
                      </div>
                    </div>
                    {selectedItem.dependencies?.length > 0 && (
                      <div>
                        <span className="text-green-200 text-sm font-medium">Dependencies Identified:</span>
                        <p className="text-white text-sm mt-1">{selectedItem.dependencies.join(', ')}</p>
                      </div>
                    )}
                    <div className="mt-4 p-3 bg-green-600/20 rounded border border-green-400/20">
                      <p className="text-green-200 text-sm"><strong>AI Enhancements:</strong></p>
                      <ul className="text-xs text-green-300 mt-1 space-y-1">
                        <li>• Converted to proper user story format</li>
                        <li>• Generated detailed acceptance criteria</li>
                        <li>• Calculated effort and ROI scores</li>
                        <li>• Identified technical dependencies</li>
                        <li>• Assigned strategic priority</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transformation Arrow */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
                <div className="bg-purple-500 rounded-full p-3">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategicBacklogAI; 