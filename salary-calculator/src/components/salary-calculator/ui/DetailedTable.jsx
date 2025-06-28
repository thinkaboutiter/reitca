import React from 'react';
import { Card } from '../shared/Card';
import { Table, TableRow, TableCell } from '../shared/Table';

export const DetailedTable = ({
  currentGrossSalary,
  employeeSocialSecurity,
  incomeTax,
  netSalary,
  employerSocialSecurity,
  totalCostToCompany,
  isCeilingApplied,
  SOCIAL_SECURITY_CEILING_BGN,
  currency,
  formatCurrency
}) => {
  const headers = [
    { title: 'Description' },
    { title: 'Rate', align: 'text-right' },
    { title: `Amount (${currency})`, align: 'text-right' },
    { title: 'Who Pays', align: 'text-right' }
  ];

  const CeilingIndicator = () => (
    isCeilingApplied ? <span className="text-orange-600 text-xs ml-1">*</span> : null
  );

  return (
    <Card className="mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Complete Breakdown</h3>
      <Table headers={headers}>
        <TableRow highlighted>
          <TableCell>Gross Salary</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right" className="font-mono">{formatCurrency(currentGrossSalary, currency)}</TableCell>
          <TableCell align="right">Base</TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell>
            Employee Pension Fund
            <CeilingIndicator />
          </TableCell>
          <TableCell align="right">9.78%</TableCell>
          <TableCell align="right" className="font-mono">-{formatCurrency(employeeSocialSecurity.pension, currency)}</TableCell>
          <TableCell align="right" className="text-red-600">Employee</TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell>
            Employee Health Insurance
            <CeilingIndicator />
          </TableCell>
          <TableCell align="right">3.20%</TableCell>
          <TableCell align="right" className="font-mono">-{formatCurrency(employeeSocialSecurity.health, currency)}</TableCell>
          <TableCell align="right" className="text-red-600">Employee</TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell>
            Employee Unemployment
            <CeilingIndicator />
          </TableCell>
          <TableCell align="right">0.80%</TableCell>
          <TableCell align="right" className="font-mono">-{formatCurrency(employeeSocialSecurity.unemployment, currency)}</TableCell>
          <TableCell align="right" className="text-red-600">Employee</TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell>Income Tax</TableCell>
          <TableCell align="right">10.00%</TableCell>
          <TableCell align="right" className="font-mono">-{formatCurrency(incomeTax, currency)}</TableCell>
          <TableCell align="right" className="text-red-600">Employee</TableCell>
        </TableRow>
        
        <TableRow highlighted>
          <TableCell>Net Salary</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right" className="font-mono">{formatCurrency(netSalary, currency)}</TableCell>
          <TableCell align="right">Employee Gets</TableCell>
        </TableRow>
        
        <TableRow className="border-t-2 border-gray-300">
          <TableCell>
            Employer Pension Fund
            <CeilingIndicator />
          </TableCell>
          <TableCell align="right">12.92%</TableCell>
          <TableCell align="right" className="font-mono">+{formatCurrency(employerSocialSecurity.pension, currency)}</TableCell>
          <TableCell align="right" className="text-blue-600">Company</TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell>
            Employer Health Insurance
            <CeilingIndicator />
          </TableCell>
          <TableCell align="right">4.80%</TableCell>
          <TableCell align="right" className="font-mono">+{formatCurrency(employerSocialSecurity.health, currency)}</TableCell>
          <TableCell align="right" className="text-blue-600">Company</TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell>
            Employer Unemployment
            <CeilingIndicator />
          </TableCell>
          <TableCell align="right">1.00%</TableCell>
          <TableCell align="right" className="font-mono">+{formatCurrency(employerSocialSecurity.unemployment, currency)}</TableCell>
          <TableCell align="right" className="text-blue-600">Company</TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell>Work Accidents Insurance</TableCell>
          <TableCell align="right">0.20%</TableCell>
          <TableCell align="right" className="font-mono">+{formatCurrency(employerSocialSecurity.workAccidents, currency)}</TableCell>
          <TableCell align="right" className="text-blue-600">Company</TableCell>
        </TableRow>
        
        <TableRow highlighted>
          <TableCell>Total Cost to Company</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right" className="font-mono">{formatCurrency(totalCostToCompany, currency)}</TableCell>
          <TableCell align="right">Company Pays</TableCell>
        </TableRow>
      </Table>
      
      {isCeilingApplied && (
        <div className="mt-3 text-xs text-orange-700">
          * Contribution capped at {formatCurrency(SOCIAL_SECURITY_CEILING_BGN, 'BGN')} monthly ceiling
        </div>
      )}
    </Card>
  );
};