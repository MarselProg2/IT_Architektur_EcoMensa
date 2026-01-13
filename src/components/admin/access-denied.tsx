import { TriangleAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AccessDenied() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/10 rounded-full p-3 w-fit">
            <TriangleAlert className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="mt-4 font-headline text-2xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You do not have the necessary permissions to view this page. Please switch to an authorized user role.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
