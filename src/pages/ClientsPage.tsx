import { useEffect, useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import { toast } from "sonner";

import { API_BASE } from "../utils/apiBase";

interface Customer {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar?: string;
  address?: string;
  city?: string;
  date_joined: string;
  total_orders?: number;
  total_spent?: number;
}

export function ClientsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/users/customers/`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.results || data || []);
      } else {
        toast.error("Impossible de charger les clients");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.username.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.first_name?.toLowerCase().includes(query) ||
      customer.last_name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-[#0A1A2F] dark:text-white mb-2">
                👥 Clients
              </h1>
              <p className="text-[#0A1A2F]/60 dark:text-gray-400">
                Gérez vos clients et leur historique d'achat
              </p>
            </div>

            {/* Search & Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="md:col-span-2 border-2 border-gray-100 dark:border-gray-800 rounded-2xl">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Rechercher un client..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl">
                <CardContent className="p-4">
                  <div className="text-sm text-[#0A1A2F]/60 dark:text-gray-400 mb-1">Total Clients</div>
                  <div className="text-3xl font-extrabold text-[#0077FF]">{customers.length}</div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl">
                <CardContent className="p-4">
                  <div className="text-sm text-[#0A1A2F]/60 dark:text-gray-400 mb-1">Actifs aujourd'hui</div>
                  <div className="text-3xl font-extrabold text-[#0077FF]">{Math.floor(customers.length * 0.35)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Customers List */}
            {loading ? (
              <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl">
                <CardContent className="p-12 text-center text-[#0A1A2F]/60 dark:text-gray-400">
                  Chargement des clients...
                </CardContent>
              </Card>
            ) : filteredCustomers.length === 0 ? (
              <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl">
                <CardContent className="p-12 text-center">
                  <User className="w-16 h-16 mx-auto mb-4 text-[#0A1A2F]/30 dark:text-gray-600" />
                  <p className="text-[#0A1A2F]/60 dark:text-gray-400 text-lg">
                    {searchQuery ? "Aucun client trouvé" : "Aucun client pour le moment"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.id} className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all hover:border-[#0077FF]/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14">
                          {customer.avatar && (
                            <AvatarImage
                              src={customer.avatar.startsWith("http") ? customer.avatar : `${API_BASE}${customer.avatar}`}
                              alt={customer.first_name || customer.username}
                            />
                          )}
                          <AvatarFallback className="bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] text-white text-xl font-bold">
                            {(customer.first_name || customer.username).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-[#0A1A2F] dark:text-white truncate text-lg">
                            {customer.first_name || customer.last_name
                              ? `${customer.first_name} ${customer.last_name}`
                              : customer.username}
                          </CardTitle>
                          <p className="text-[#0A1A2F]/60 dark:text-gray-400 text-sm truncate">
                            @{customer.username}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-[#0A1A2F]/70 dark:text-gray-300">
                        <Mail className="w-4 h-4 text-[#0077FF]" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      
                      {customer.phone_number && (
                        <div className="flex items-center gap-2 text-sm text-[#0A1A2F]/70 dark:text-gray-300">
                          <Phone className="w-4 h-4 text-[#0077FF]" />
                          <span>{customer.phone_number}</span>
                        </div>
                      )}
                      
                      {customer.city && (
                        <div className="flex items-center gap-2 text-sm text-[#0A1A2F]/70 dark:text-gray-300">
                          <MapPin className="w-4 h-4 text-[#0077FF]" />
                          <span>{customer.city}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-[#0A1A2F]/70 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-[#0077FF]" />
                        <span>Client depuis {new Date(customer.date_joined).toLocaleDateString("fr-FR")}</span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-center p-2 bg-[#0077FF]/5 rounded-lg">
                          <div className="text-xs text-[#0A1A2F]/60 dark:text-gray-400">Commandes</div>
                          <div className="text-lg font-bold text-[#0077FF]">{customer.total_orders || 0}</div>
                        </div>
                        <div className="text-center p-2 bg-[#0077FF]/5 rounded-lg">
                          <div className="text-xs text-[#0A1A2F]/60 dark:text-gray-400">Total dépensé</div>
                          <div className="text-lg font-bold text-[#0077FF]">{customer.total_spent || 0} DZD</div>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl h-10 mt-3"
                        onClick={() => toast.info(`Détails de ${customer.first_name || customer.username} - Fonctionnalité à venir`)}
                      >
                        Voir détails
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
