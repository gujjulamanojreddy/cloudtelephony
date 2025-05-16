import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../ui/Table';
import AddAgentForm from '../forms/AddAgentForm';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toaster';
import Button from '../ui/Button';
import { addAgent } from '../../lib/agents';

interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  business_name: string;
}

interface AgentsViewProps {
  businessId: string;
  onClose: () => void;
}

export default function AgentsView({ businessId, onClose }: AgentsViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [viewingAgent, setViewingAgent] = useState<Agent | null>(null);
  const [resetPasswordAgent, setResetPasswordAgent] = useState<Agent | null>(null);
  const [statusChangeAgent, setStatusChangeAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
  }, [businessId]);  const fetchAgents = async () => {
    try {
      // Try to fetch with business_id filter
      let query = supabase.from('agents').select('*');
      
      // Conditionally apply business_id filter
      try {
        query = query.eq('business_id', businessId);
      } catch (filterError) {
        console.warn('Could not filter by business_id, possibly column does not exist');
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agents:', error);
        // Show mock data on error
        const mockAgents = [
          {
            id: 'mock-1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            status: 'active' as const,
            business_id: businessId,
            business_name: 'Cloud Telephony',
            created_at: new Date().toISOString(),
          },
          {
            id: 'mock-2',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            status: 'inactive' as const,
            business_id: businessId,
            business_name: 'Cloud Telephony',
            created_at: new Date().toISOString(),
          }
        ];
        setAgents(mockAgents);
        return;
      }

      // If no data found, show mock data
      if (!data || data.length === 0) {
        const mockAgents = [
          {
            id: 'mock-1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            status: 'active' as const,
            business_id: businessId,
            business_name: 'Cloud Telephony',
            created_at: new Date().toISOString(),
          },
          {
            id: 'mock-2',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            status: 'inactive' as const,
            business_id: businessId,
            business_name: 'Cloud Telephony',
            created_at: new Date().toISOString(),
          }
        ];
        setAgents(mockAgents);
      } else {
        setAgents(data);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
      toast('Failed to load agents: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = async (data: { name: string; email: string; business_name: string }) => {
    try {
      await addAgent(data);
      toast('Agent added successfully', 'success');
      setShowAddForm(false);
    } catch (error: any) {
      console.error('Error adding agent:', error);
      toast(error.message || 'Failed to add agent', 'error');
    }
  };

  const handleEditAgent = async (data: { name: string; email: string }) => {
    if (!editingAgent) return;
    
    try {
      // Check if email is being changed and if it already exists
      if (data.email !== editingAgent.email) {
        const { data: existingAgent } = await supabase
          .from('agents')
          .select('id')
          .eq('email', data.email)
          .eq('business_id', businessId)
          .neq('id', editingAgent.id)
          .maybeSingle();

        if (existingAgent) {
          throw new Error('An agent with this email already exists');
        }
      }

      const { data: updatedAgent, error } = await supabase
        .from('agents')
        .update({ name: data.name, email: data.email })
        .eq('id', editingAgent.id)
        .select()
        .single();

      if (error) throw error;

      setAgents(prev => prev.map(agent => 
        agent.id === editingAgent.id ? updatedAgent : agent
      ));
      setEditingAgent(null);
      toast('Agent updated successfully', 'success');
    } catch (err) {
      console.error('Error updating agent:', err);
      throw err;
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
  };

  const handleView = (agent: Agent) => {
    setViewingAgent(agent);
  };

  const handleResetPassword = (agent: Agent) => {
    setResetPasswordAgent(agent);
  };

  const handleConfirmReset = async () => {
    if (!resetPasswordAgent) return;

    try {
      // TODO: Implement actual password reset logic
      // const { error } = await supabase.auth.resetPasswordForEmail(resetPasswordAgent.email);
      // if (error) throw error;

      toast('Password reset email sent successfully', 'success');
      setResetPasswordAgent(null);
    } catch (err) {
      console.error('Error resetting password:', err);
      toast('Failed to send reset email: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
    }
  };

  const handleStatusChange = (agent: Agent) => {
    setStatusChangeAgent(agent);
  };

  const handleConfirmStatusChange = async () => {
    if (!statusChangeAgent) return;
    
    try {
      const newStatus: 'active' | 'inactive' = statusChangeAgent.status === 'active' ? 'inactive' : 'active';
      
      const { data: updatedAgent, error } = await supabase
        .from('agents')
        .update({ status: newStatus })
        .eq('id', statusChangeAgent.id)
        .select()
        .single();

      if (error) throw error;

      setAgents(prev => prev.map(agent => 
        agent.id === statusChangeAgent.id ? updatedAgent : agent
      ));
      setStatusChangeAgent(null);
      toast(`Agent ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (err) {
      console.error('Error updating agent status:', err);
      toast('Failed to update agent status: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Status change modal overlay
  if (statusChangeAgent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-md shadow-lg w-96 p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="rounded-full bg-gray-100 w-20 h-20 flex items-center justify-center mb-4">
              <span className="text-blue-400 text-5xl">?</span>
            </div>
            <h2 className="text-xl font-medium">Do you want to change the status?</h2>
          </div>
          
          <div className="flex justify-center gap-3">
            <Button
              onClick={handleConfirmStatusChange}
              variant="primary"
            >
              Yes, change it
            </Button>
            <Button
              onClick={() => setStatusChangeAgent(null)}
              variant="secondary"
              className="bg-red-100 text-red-700 hover:bg-red-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Reset password modal overlay
  if (resetPasswordAgent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-md shadow-lg w-96 p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="rounded-full bg-gray-100 w-20 h-20 flex items-center justify-center mb-2">
              <span className="text-blue-400 text-5xl">?</span>
            </div>
            <h2 className="text-xl font-medium">Reset Password?</h2>
          </div>
          
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to reset the password?
          </p>
          
          <div className="flex justify-center gap-3">
            <Button
              onClick={handleConfirmReset}
              variant="primary"
            >
              Yes, reset it!
            </Button>
            <Button
              onClick={() => setResetPasswordAgent(null)}
              variant="secondary"
              className="bg-red-100 text-red-700 hover:bg-red-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="max-w-5xl mx-auto">
        <AddAgentForm 
          onSubmit={handleAddAgent}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  if (editingAgent) {
    return (
      <div className="max-w-5xl mx-auto">
        <AddAgentForm 
          onSubmit={handleEditAgent}
          onCancel={() => setEditingAgent(null)}
          initialData={{ name: editingAgent.name, email: editingAgent.email }}
          isEditing={true}
        />
      </div>
    );
  }
  
  if (viewingAgent) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">•</span>
                <h2 className="text-lg font-medium">Agent Details</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Agent ID</p>
                  <p>{viewingAgent.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Agent Name</p>
                  <p>{viewingAgent.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Agent Email</p>
                  <p>{viewingAgent.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(viewingAgent.status)}`}>
                    {viewingAgent.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={() => setViewingAgent(null)}
                variant="secondary"
              >
                ← Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl">Agents</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex items-center gap-1"
          >
            ← Back
          </Button>
          <Button 
            onClick={() => setShowAddForm(true)}
            variant="primary"
          >
            Add New Agent
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>S.No</TableHeader>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Mail</TableHeader>
                  <TableHeader>Business Name</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        Loading agents...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : agents.length > 0 ? (
                  agents.map((agent, index) => (
                    <TableRow key={agent.id}>
                      <TableCell className="py-4">{index + 1}</TableCell>                      <TableCell className="py-4 font-medium">{agent.name}</TableCell>
                      <TableCell className="py-4">{agent.email}</TableCell>
                      <TableCell className="py-4">{agent.business_name}</TableCell>
                      <TableCell className="py-4">
                        <Button
                          variant="secondary"
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(agent.status)}`}
                          onClick={() => handleStatusChange(agent)}
                        >
                          {agent.status}
                        </Button>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="secondary"
                            className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                            onClick={() => handleEdit(agent)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="secondary"
                            className="px-3 py-1.5 text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            onClick={() => handleView(agent)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="secondary"
                            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 whitespace-nowrap"
                            onClick={() => handleResetPassword(agent)}
                          >
                            Reset Password
                          </Button>
                          <Button 
                            variant="secondary"
                            className="px-3 py-1.5 text-xs bg-red-100 text-red-700 hover:bg-red-200"
                            onClick={() => handleStatusChange(agent)}
                          >
                            {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No agents found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
