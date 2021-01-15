'*** START UP
'Redacted'
'Set ... = ...

	Set objDict = CreateObject("Scripting.Dictionary")
	objDict.Add FormatDateTime("01/01/21", 2), "ACME Holiday - United States, New Year's Day"
	objDict.Add FormatDateTime("01/18/21", 2), "ACME Holiday - United States, Martin Luther King, Jr. Day"     
	objDict.Add FormatDateTime("05/31/21", 2), "ACME Holiday - United States, Memorial Day"    
	objDict.Add FormatDateTime("07/05/21", 2), "ACME Holiday - United States, Independence Day (Observed)"    
	objDict.Add FormatDateTime("09/06/21", 2), "ACME Holiday - United States, Labor Day"
	objDict.Add FormatDateTime("11/25/21", 2), "ACME Holiday - United States, Thanksgiving Day"   
	objDict.Add FormatDateTime("11/26/21", 2), "ACME Holiday - United States, Day After Thanksgiving"
	objDict.Add FormatDateTime("12/24/21", 2), "ACME Holiday - United States, Christmas Holiday"    

'*** IMPORT TO OUTLOOK
'Redacted'

	Wscript.echo "Done Importing Holidays."

'*** CLEAN UP
'Redacted'
'Set ... = Nothing
